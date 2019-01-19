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
  private users$ = [];
  private endOfContent: boolean = false;

  private isAdmin: boolean = false;


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
}
