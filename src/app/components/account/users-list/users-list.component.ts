import { Component, OnInit } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { UsersServiceService } from 'src/app/services/user/users-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  // Constants
  private count = 36;
  private offset = 0;

  public userid = null;

  // Users list.
  public users$ = [];
  public endOfContent: boolean = false;

  public isAdmin: boolean = false;

  // Output message for things such as admin changing a user privilege level.
  public message: string = null;


  // User search.
  public isSearching: boolean = false;
  public searchTerm: string = '';
  public searchUsers = [];


  constructor(
    private userService: UsersServiceService,
    private signIn: SignInService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get user sign in status. Redirect if not signed in.
    this.signIn.userInternalRecord().subscribe((rec) => {
      if (rec == null) {
        this.router.navigate([environment.routes.account_signIn]);
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


    // Add event listener to user search input.
    document.getElementById('userSearchInput').addEventListener('input', this.userSearchInputOnInput);

    // Get initial users to show.
    this.getUsers();
  }



  /**
   * Scroll event for infinite scroll.
   */
  public onScroll() {
    if (!this.endOfContent) {
      this.getUsers();
    }
  }

  /**
   * Attempt to get users to display from api.
   */
  private getUsers() {
    this.userService.getUsers(this.count, this.offset).subscribe((users: User[]) => {
      let length = users.length;
      if (length > 0) {
        // Filter out current user if included.
        users = users.filter(u => u.id !== this.userid);
        // Filter out banned users if user is not admin.
        if (!this.isAdmin) {
          users = users.filter(u => !u.banned);
        }
        
        this.users$ = this.users$.concat(users);
        this.offset += length;
        if (length < this.count) {
          // If we couldn't get the desired number, must have gotten last few records.
          this.endOfContent = true;
        }

        // If searching, filter the fetched records and append them to the end of the search list.
        if (this.isSearching) {
          this.searchUsers = this.searchUsers.concat(users.filter(v => v.displayname.includes(this.searchTerm)));
        }

        // If searching, and current number of matched users is less than count, AND end of content has not been reached...
        if (this.isSearching &&
            this.searchUsers.length < this.count &&
            !this.endOfContent) {
              /* Attempt to get more users from api. Repeat this until either the search list
                  contains count-number of items, or the end of content is reached. */
              this.getUsers();
        }
      } else {
        // Empty list. Must be end of users.
        this.endOfContent = true;
      }
    })
  }





  // *** ADMIN CONTROLS ***
  /**
   * Sets a users admin status.
   * @param index - index of user in list.
   * @param state - whether to set user to admin.
   */
  public setAdminStatus(index, state: boolean) {
    // If searching, get index of user from main list. (index is from search list)
    let originalIndex = index;
    if (this.isSearching) {
      index = this.users$.indexOf(this.searchUsers[index]);
    }

    // Check current user is admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.users$.length) { return; }
    // Check not the current user.
    if (this.users$[index].id == this.userid) { return; }

    this.userService.setUserAdminStatus(this.users$[index].id, state).subscribe((res) => {
      // Update user record stored.
      this.users$[index] = res[0];
      // If searching, update record from search list.
      if (this.isSearching) { this.searchUsers[originalIndex] = res[0]; }

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
  public setBannedStatus(index, state: boolean) {
    // If searching, get index of user from main list. (index is from search list)
    let originalIndex = index;
    if (this.isSearching) {
      index = this.users$.indexOf(this.searchUsers[index]);
    }

    // Check current user is admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.users$.length) { return; }
    // Check not the current user.
    if (this.users$[index].id == this.userid) { return; }

    this.userService.setUserBannedStatus(this.users$[index].id, state).subscribe((res) => {
      // Update user record stored.
      this.users$[index] = res[0];
      // If searching, update record from search list.
      if (this.isSearching) { this.searchUsers[originalIndex] = res[0]; }

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
  // END OF ADMIN CONTROLS






  // User search methods.
  /**
   * Gets user list to use for showing users. If searching, use search list.
   */
  public getUserList(): User[] {
    if (this.isSearching) { return this.searchUsers; }
    return this.users$;
  }

  

  // Handle for timeout, so that it can be cancelled and reset to 'extend' it.
  private userSearchInputTimeoutHandle = null;
  // Event listener for input for search.
  public userSearchInputOnInput = (e) => {
    // Clear timeout if set.
    clearTimeout(this.userSearchInputTimeoutHandle);

    // Set new timeout in 1000ms.
    this.searchTerm = e.target.value;
    this.userSearchInputTimeoutHandle = setTimeout(() => {
      // Set whether searching user. (Where input is not empty)
      this.isSearching = this.searchTerm !== '';

      // Filter users whose displayname contains search value as substring.
      this.searchUsers = this.users$.filter(v => v.displayname.includes(this.searchTerm));
      
      // If less than count number of users have been matched, attempt to get more users from the api.
      if (this.searchUsers.length < this.count) {
        this.getUsers();
      }
    }, 1000);
  }

}
