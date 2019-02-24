import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(
    private router: Router,
    private signIn: SignInService
  ) { }



  ngOnInit() {
    // Subscribe to user's logged in status. If they log in, redirect them to account area.
    this.signIn.user().subscribe((user) => {
      if (user !== null) {
        this.router.navigate([ environment.routes.account ]);
      }
    }, (err) => {
      console.error('Error with authState on signin page:', err);
    });
  }



  // Methods for signing in with social media account.
  private signInWithGoogle(): void {
    this.signIn.signInWithGoogle();
  }

  private signInWithFacebook(): void {
    this.signIn.signInWithFacebook();
  }


}
