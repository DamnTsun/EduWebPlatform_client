import { Injectable } from '@angular/core';
import { AuthService, SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthObject } from '../classes/AuthObject';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  // Store user. Make is an observable so that components may subscribe to it.
  private userRecord: BehaviorSubject<SocialUser> = new BehaviorSubject(null);
  private userRecordCurrent: SocialUser = null;
  public user(): Observable<SocialUser> { return this.userRecord.asObservable(); }
  // Store user admin status.
  private userIsAdminRecord: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public userIsAdmin(): Observable<boolean> { return this.userIsAdminRecord.asObservable(); }

  // Auth object for signed in user. Contain information about users internal user record.
  // Such as: JWT for user, when JWT expires.
  private authObject: AuthObject = null;



  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {

    // Subscribe to AuthService login event to get user.
    this.auth.authState.subscribe((user) => {

      // Update observable and store current value.
      this.userRecord.next(user);
      this.userRecordCurrent = user;


      // Get / clear authentication with backend.
      if (user !== null) {
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
      // TODO LinkedIn login...

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
      this.authObject = res;
      this.userIsAdminRecord.next(this.authObject.isAdmin);
      console.log(this.authObject);
    }, (err) => {
      console.log('SignIn Service - Google - Auth Error:', err);
    })
  }
  /**
   * Attempts to authorize with backend API.
   * If successful, will get a JWT for internal user account.
   */
  private authorizeWithAPIFacebook(): void {
    // Attempt to authorize using Google.
    this.api.authorizeWithBackendFacebook(this.userRecordCurrent.authToken).subscribe((res) => {
      this.authObject = res;
    }, (err) => {
      console.log('SignIn Service - Facebook - Auth Error:', err);
    });
  }

  /**
   * Clears authorization will backend. Deleted JWT.
   */
  private clearAuthorization(): void {
    this.authObject = null;
    this.userIsAdminRecord.next(false);
  }



  /**
   * Checks wheter signed in user is an admin and updates isUserAdminRecord (and observable).
   */
  private checkUserAdminStatus(): void {
    
  }
  // *** END OF AUTHORIZING USER ***




  // Methods
  /**
   * Signs out of account.
   */
  public signOut(): void {
    this.auth.signOut();
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
}
