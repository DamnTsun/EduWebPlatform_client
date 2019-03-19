import { Injectable } from '@angular/core';
import { AuthService, SocialUser, GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  // Store social media account.
  private userRecord: BehaviorSubject<SocialUser> = new BehaviorSubject(null);
  private userRecordCurrent: SocialUser = null;
  public user(): Observable<SocialUser> { return this.userRecord.asObservable(); }
  // Store internal user record.
  private userInternalRecordRecord: BehaviorSubject<object> = new BehaviorSubject(null);
  public userInternalRecord() { return this.userInternalRecordRecord.asObservable(); }
  // Store user admin status.
  private userIsAdminRecord: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userIsAdmin(): Observable<boolean> { return this.userIsAdminRecord.asObservable(); }

  // Handle for reauthorization timeout. (Where user reauthorizes before old auth token expires)
  // Allows timeout to be cancelled if user signs out.
  private reauthorizationTimeoutHandle = null;
  // How many seconds before auth token expiry that re-authorization should be attempted.
  private readonly REAUTH_BUFFER_TIME: number = 30;





  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {

    // Subscribe to AuthService login event to get users social media account.
    this.auth.authState.subscribe((user) => {

      // Update observable and store current value.
      this.userRecord.next(user);
      this.userRecordCurrent = user;


      // Get / clear authentication with backend.
      if (user !== null) {
        // Show social media account info (name, email, id token) if debug param set.
        if (!environment.production && environment.debug.showSocialMediaSignInObjects) {
          console.log('User Social Media Object:', user);
        }

        // Authorize with API for social media account type.
        this.authorizeUser(user.provider);
      } else {
        // User signed out. Clear authorization.
        this.clearAuthorization();
      }
    }, (err) => {
      console.error('SignInService user Error:', err);
      this.userRecord.next(null);
    });
  }





  // *** AUTHORIZING USER ***
  /**
   * Authorizes a user, or signs them out if provider is not supported.
   * @param provider - name of provider, such as GOOGLE or FACEBOOK.
   */
  private authorizeUser(provider: string): void {
    switch (provider) {
      case GoogleLoginProvider.PROVIDER_ID:
        this.authorizeWithAPIGoogle();
        break;
      case FacebookLoginProvider.PROVIDER_ID:
        this.authorizeWithAPIFacebook();
        break;

      default:
        // Provider not supported. Forcably sign user out.
        this.signOut();
        break;
    }
  }
  /**
   * Attempts to authorize with backend API.
   * If successful, will get a JWT for internal user account.
   */
  private authorizeWithAPIGoogle(): void {
    // Attempt to authorize using Google.
    this.api.authorizeWithBackendGoogle(this.userRecordCurrent.idToken).subscribe((res) => {
      this.api.setAuthObject(res);                      // Set auth object to enable API requests that need idToken header.
      this.userIsAdminRecord.next(res.isAdmin);         // Set user admin status for components to use.
      this.getUserInfo();                               // Get and store the users internal user record data, such as their displayname.

      // Setup timeout to attempt to reauthorize with API when token has nearly expired.
      // Get time between now and token expiry.
      let delta = (res.expiresAt - Math.floor(new Date().getTime() / 1000));
      // Rerun this method after delta - buffer time has elapsed.
      this.reauthorizationTimeoutHandle = setTimeout(() => {
        this.authorizeWithAPIGoogle(); // Rerun this method.
      },
        (delta - this.REAUTH_BUFFER_TIME) * 1000 // Time in ms.
      );
    },
      // On failure.
      this.handleAuthFailure
    )
  }
  /**
   * Attempts to authorize with backend API.
   * If successful, will get a JWT for internal user account.
   */
  private authorizeWithAPIFacebook(): void {
    // Attempt to authorize using Google.
    this.api.authorizeWithBackendFacebook(this.userRecordCurrent.authToken).subscribe((res) => {
      this.api.setAuthObject(res);                      // Set auth object to enable API requests that need idToken header.
      this.userIsAdminRecord.next(res.isAdmin);         // Set user admin status for components to use.
      this.getUserInfo();                               // Get and store the users internal user record data, such as their displayname.

      // Setup timeout to attempt to reauthorize with API when token has nearly expired.
      // Get time between now and token expiry.
      let delta = (res.expiresAt - Math.floor(new Date().getTime() / 1000));
      // Rerun this method after delta - buffer time has elapsed.
      this.reauthorizationTimeoutHandle = setTimeout(() => {
        this.authorizeWithAPIFacebook(); // Rerun this method.
      },
        (delta - this.REAUTH_BUFFER_TIME) * 1000 // Time in ms.
      );
    },
      // On failure.
      this.handleAuthFailure
    );
  }



  /**
   * Clears reauthorizationTimeoutHandle so that reauthorization timeout never occurs.
   */
  private clearReauthorizationTimeout(): void {
    clearTimeout(this.reauthorizationTimeoutHandle);
    this.reauthorizationTimeoutHandle = null;
  }



  /**
   * Error handler for when authorization methods fail.
   */
  private handleAuthFailure = (err) => {
    // Check against expected error codes.
    switch (err.status) {
      case 401: // User is banned...
        // Display message. Use a 1ms timeout so that it is asynchronous / non-blocking.
        // Then sign user out.
        setTimeout(() => {
          alert('Sorry, this account is banned.\nYou will be automatically signed out.');
        }, 1);
        this.signOut();
        break;
    }
  }


  /**
   * Clears authorization will backend. Deletes JWT.
   */
  private clearAuthorization(): void {
    // Clear auth object, mark user as not an admin, clear user record data.
    this.api.clearAuthObject();
    this.userIsAdminRecord.next(false);
    this.userInternalRecordRecord.next(null);
  }
  // *** END OF AUTHORIZING USER ***




  // Methods
  /**
   * Signs out of account.
   */
  public signOut(): void {
    this.auth.signOut();
    this.clearReauthorizationTimeout();
    this.clearAuthorization();
  }

  /**
   * Prompts user to sign in with Google.
   */
  public signInWithGoogle(): void {
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
  /**
   * Prompts user to sign in with Facebook.
   */
  public signInWithFacebook(): void {
    this.auth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }



  /**
   * Gets information about the current users interal record.
   */
  public getUserInfo() {
    this.api.get(environment.apiUrl + `users/me`).subscribe((user) => {
      this.userInternalRecordRecord.next(user);
    });
  }



  /**
   * Updates user's display on api.
   * @param newName - new name for user.
   */
  public updateUserDisplayname(newName) {
    // Update users name.
    let data = new FormData();
    data.set('content', JSON.stringify({ name: newName }));
    this.api.post(environment.apiUrl + `users/me/name`, data).subscribe((res) => {
      // Successful. Update stored user details.
      this.userInternalRecordRecord.next(res);
    });
  }


  /**
   * Deletes the internal user record of the user currently signed in.
   */
  public deleteCurrentUsersAccount() {
    return this.api.delete(environment.apiUrl + `users/me`);
  }
}
