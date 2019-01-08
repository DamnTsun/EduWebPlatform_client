import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }



  ngOnInit() {
    // Subscribe to user's logged in status. If they log in, redirect them to account area.
    this.auth.authState.subscribe((user) => {
      if (user !== null) {
        this.router.navigate([ environment.routes.account ]);
      }
    }, (err) => {
      console.error('Error with authState on signin page:', err);
    });
  }

  /**
   * Signs user in with Google account. Sends to them to Google's OAuth stuff if necessary.
   */
  private signInWithGoogle(): void {
    this.auth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  private signInWithFacebook(): void {
    this.auth.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
