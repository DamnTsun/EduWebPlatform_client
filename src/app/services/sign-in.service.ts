import { Injectable } from '@angular/core';
import { AuthService, SocialUser, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  // Store user. Make is an observable so that components may subscribe to it.
  private userRecord: BehaviorSubject<SocialUser> = new BehaviorSubject(null);
  private userRecordCurrent: SocialUser = null;
  public user(): Observable<SocialUser> { return this.userRecord.asObservable(); }

  private jwt: string;



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
        this.authorizeWithAPI();
      } else {
        this.clearAuthorization();
      }
    }, (err) => {
      console.error('SignInService user Error:', err);
      this.userRecord.next(null);
    });
  }

  /**
   * Attempts to authorize with backend API.
   * If successful, will get a JWT for internal user account.
   */
  private authorizeWithAPI(): void {
    console.log(this.userRecordCurrent.idToken);
    this.api.authorizeWithBackendGoogle(this.userRecordCurrent.idToken).subscribe((res) => {
      console.log(res);
    })
  }

  /**
   * Clears authorization will backend. Deleted JWT.
   */
  private clearAuthorization(): void {
    this.jwt = null;
  }




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
