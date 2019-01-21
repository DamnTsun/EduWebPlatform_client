import { Component, OnInit } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { UsersServiceService } from 'src/app/services/user/users-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  // Constants
  private count = 10;
  private offset = 0;

  private userid = null;

  // Users list.
  private users$ = [];
  private endOfContent: boolean = false;

  private isAdmin: boolean = false;

  private message: string = null;


  constructor(
    private userService: UsersServiceService,
    private signIn: SignInService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get user sign in status. Redirect if not signed in.
    this.signIn.userInternalRecord().subscribe((rec) => {
      if (rec == null) {
        this.router.navigate([ environment.routes.account_signIn ]);
        return;
      }
      this.userid = rec[0].id;
    }, (err) => {
      console.error('Users-List internalRecord error:', err);
    });


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Users-List isAdmin error:', err);
    });


    // Get initial users to show.
    this.getUsers();
  }

  

  /**
   * Scroll event for infinite scroll.
   */
  private onScroll() {
    if (!this.endOfContent) {
      this.getUsers();
    }
  }

  /**
   * Attempt to get users to display from api.
   */
  private getUsers() {
    this.userService.getUsers(this.count, this.offset).subscribe((users: object[]) => {
      if (users.length > 0) {
        this.users$ = this.users$.concat(users);
        this.offset += users.length;
        if (users.length < this.count) {
          // If we couldn't get the desired number, must have gotten last few records.
          this.endOfContent = true;
        }
      } else {
        // Empty list. Must be end of users.
        this.endOfContent = true;
      }
    })
  }



  /**
   * Sets a users admin status.
   * @param index - index of user in list.
   * @param state - whether to set user to admin.
   */
  private setAdminStatus(index, state: boolean) {
    // Check current user is admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.users$.length) { return; }
    // Check not the current user.
    if (this.users$[index].id == this.userid) { return; }

    this.userService.setUserAdminStatus(this.users$[index].id, state).subscribe((res) => {
      // Update user record stored.
      this.users$[index] = res[0];
      // Show message that user has been made admin / not admin.
      if (state) {
        this.message = `User '${this.users$[index].displayname} (#${this.users$[index].id})' has been promoted to an admin.`;
      } else {
        this.message = `User '${this.users$[index].displayname} (#${this.users$[index].id})' has been demoted to a regular user.`;
      }
    }, (err) => {
      console.error('UserList setAdmin error:', err);
    })
  }

  /**
   * Sets a users banned status.
   * @param index - index of user in list.
   * @param state - whether to set user to banned.
   */
  private setBannedStatus(index, state: boolean) {
    // Check current user is admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.users$.length) { return; }

    this.userService.setUserBannedStatus(this.users$[index].id, state).subscribe((res) => {
      // Update user record stored.
      this.users$[index] = res[0];
      // Show message that user has been made banned / not banned.
      if (state) {
        this.message = `User '${this.users$[index].displayname} (#${this.users$[index].id})' has been banned.`;
      } else {
        this.message = `User '${this.users$[index].displayname} (#${this.users$[index].id})' has been unbanned.`;
      }
    }, (err) => {
      console.error('UserList setBanned error:', err);
    });
  }
}
