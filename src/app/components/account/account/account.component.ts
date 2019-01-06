import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, SocialUser } from 'angularx-social-login';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private user$: SocialUser = null;



  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to user's logged in status. If they log out, redirect them to sign in area.
    this.auth.authState.subscribe((user) => {
      this.user$ = user;
      if (user === null) {
        this.router.navigate([ environment.routes.account_signIn ]);
      }
      // *** DEBUGGING API SIGNING IN USING ID TOKENS - REMOVE THIS BEFORE RELEASE ***
      console.log(user);
    }, (err) => {
      console.error('Error with authState on account page:', err);
    });
  }



  /**
   * Signs user out of the platform.
   */
  private signOut(): void {
    this.auth.signOut();
  }
}
