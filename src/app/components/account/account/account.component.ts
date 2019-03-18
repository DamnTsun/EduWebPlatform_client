import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SignInService } from 'src/app/services/sign-in.service';
import { UserTestsService } from 'src/app/services/user/user-tests.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public user$ = null;
  public errorMessage: string = null;          // Error message if something goes wrong.

  public deleteAccountMessage: string = null;
  public deleteResultsMessage: string = null;




  constructor(
    private router: Router,
    private signIn: SignInService,
    private userTestService: UserTestsService
  ) { }

  ngOnInit() {
    // Subscribe to user's logged in status. If they log out, redirect them to sign in area.
    this.signIn.user().subscribe((user) => {
      if (user === null) {
        this.router.navigate([ environment.routes.account_signIn ]);
      }
    }, (err) => {
      console.error('Error with authState on account page:', err);
    });


    // Subscribe to internal user record.
    this.signIn.userInternalRecord().subscribe((user) => {
      if (user == null) { this.user$ = null; return; }
      this.user$ = user[0];
    })
  }



  /**
   * Signs user out of the platform.
   */
  public signOut(): void {
    this.signIn.signOut();
  }



  /**
   * Updates the users name, if the new value is valid.
   */
  public updateName(): void {
    // Get name from input.
    let name = <HTMLInputElement>document.getElementById('displayNameInput');
    if (name == null) { return; }
    // Validate.
    if (name.value.trim().length < 1 || name.value.trim().length > 50) {
      this.errorMessage = 'Name is not valid. Name must be between 1 and 50 characters long.';
      return;
    }
    // Check not same as original.
    if (name.value.trim() == this.user$.displayname) {
      this.errorMessage = 'Name not updated. Name is the same as current name.';
      return;
    }


    // Remove errormessage if shown.
    this.errorMessage = null;

    // Attempt to update name.
    this.signIn.updateUserDisplayname(name.value.trim());
  }



  /**
   * Deletes the users account.
   */
  public deleteAccount(): void {
    // Delete the users account.
    this.signIn.deleteCurrentUsersAccount().subscribe((res) => {
      this.signIn.signOut();
      this.router.navigate([ environment.routes.account_signIn ]);
    }, (err) => {
      this.deleteAccountMessage = 'Something went wrong. Unable to delete your account.';
    });
  }


  /**
   * Deletes the users user tests.
   */
  public deleteAllUserTests(): void {
    // Delete the users test results.
    this.userTestService.deleteAllCurrentUserUserTests().subscribe((res) => {
      this.deleteResultsMessage = 'Your test results have been deleted successfully.';
    }, (err) => {
      this.deleteResultsMessage = 'Something went wrong. Unable to delete your test results.';
    });
  }


  /**
   * Gets site name for use in HTML.
   */
  public getSiteName(): string {
    return environment.siteName;
  }
}
