import { Component, OnInit } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { GroupService } from 'src/app/services/group/group.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { environment } from 'src/environments/environment';
import { Group } from 'src/app/classes/Group';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-group-home',
  templateUrl: './group-home.component.html',
  styleUrls: ['./group-home.component.css']
})
export class GroupHomeComponent implements OnInit {

  // User id and whether they are an admin.
  public userid = null;
  public isAdmin: boolean = false;

  // Group being viewed.
  public groupid = null;
  public group$: Group = null;
  public groupLoadingError: boolean = false;

  // Members of group.
  public groupMembers$ = [];
  private groupMembers_count = 18;
  private groupMembers_offset = 0;
  public groupMembers_endOfContent: boolean = false;
  // Non-members.
  public groupNonMembers$ = [];
  private groupNonMembers_count = 18;
  private groupNonMembers_offset = 0;
  public groupNonMembers_endOfContent: boolean = false;




  constructor(
    private signIn: SignInService,                  // For getting user signed in / admin status.
    private groupService: GroupService,             // For interacting with groups on api.
    private route: ActivatedRoute,                  // For getting route params.
    private router: Router,                         // For redirecting user if necessary.
    private navService: NavigationServiceService    // For getting routes for redirects.
  ) { }

  ngOnInit() {
    // Get route params.
    this.groupid = this.route.snapshot.paramMap.get(environment.routeParams.groupid);


    // Check user signed in.
    this.signIn.userInternalRecord().subscribe((user) => {
      // If user not signed in, redirect to sign in.
      if (user == null) {
        this.router.navigate([environment.routes.account_signIn]);
        return;
      }
      this.userid = user[0].id;
    }, (err) => {
      console.error('Group home sign in Error:', err);
    });


    // Check user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Group home admin Error:', err);
    });


    // Get group data.
    this.groupService.getGroup(this.groupid).subscribe((group: Group[]) => {
      this.group$ = group[0];
      // After getting group, get initial members and nonmembers of group. (initial)
      this.getGroupMembers();
      this.getGroupNonMembers();
    }, (err) => {
      console.error('Group home get group Error:', err);
      this.groupLoadingError = true;
    });
  }





  // *** Members methods ***
  /**
   * Scroll event for infinite scroll (members tab)
   */
  public groupMembers_onScroll(): void {
    if (!this.groupMembers_endOfContent) {
      this.getGroupMembers();
    }
  }


  /**
   * Attempts to get group members from api.
   */
  private getGroupMembers(): void {
    this.groupService.getGroupMembers(this.group$.id, this.groupMembers_count, this.groupMembers_offset)
      .subscribe((members: User[]) => {
        if (members.length > 0) {
          // Remove current user from list if included.
          this.groupMembers$ = this.groupMembers$.concat(members.filter(u => u.id !== this.userid));
          this.groupMembers_offset += members.length;
          // If less records received than asked for, must be end.
          if (members.length < this.groupMembers_count) {
            this.groupMembers_endOfContent = true;
          }
        } else {
          // No records received. Must be end.
          this.groupMembers_endOfContent = true;
        }
      }, (err) => {
        console.error('Group home get members Error:', err);
      });
  }





  // Index of user to be removed from group. Used by remove user modal.
  public removeUserIndex = null;
  /**
   * Removes the specified user from the group.
   * @param index - index of user in groupMemebers$ array.
   */
  public removeUserFromGroup(index): void {
    // Check index.
    if (index < 0 || index >= this.groupMembers$.length) { return; }

    this.groupService.removeMemberFromGroup(this.group$.id, this.groupMembers$[index].id).subscribe((res) => {
      // Successful. Add user record to non-members list if appropriate.
      // If non-members list is empty. Add
      if (this.groupNonMembers$.length == 0) {
        this.groupNonMembers$.push(this.groupMembers$[index]);
        this.groupNonMembers_offset++;
      }
      // If id of removed user is lower than id of last user in non members list.
      else if (this.groupNonMembers$[this.groupNonMembers$.length - 1].id > this.groupMembers$[index].id) {
        // Add to end of list. Then sort by id.
        this.groupNonMembers$.push(this.groupMembers$[index]);
        this.groupNonMembers$.sort((a, b) => { return a.id - b.id; });
        this.groupNonMembers_offset++;
      }

      // Remove user record from members list.
      this.groupMembers$ = this.groupMembers$.filter((ele, i) => { return i !== index; });
    }, (err) => {
      console.error('Group home remove user Error:', err);
    });
  }
  // *** End of members methods ***










  // *** Non-members methods ***
  /**
   * Scroll event for infinite scroll (non-members tab)
   */
  public groupNonMembers_onScroll(): void {
    if (!this.groupNonMembers_endOfContent) {
      this.getGroupNonMembers();
    }
  }


  /**
   * Attempts to get group non-members from api.
   */
  private getGroupNonMembers(): void {
    this.groupService.getGroupNonMembers(this.group$.id, this.groupNonMembers_count, this.groupNonMembers_offset)
      .subscribe((users: User[]) => {
        if (users.length > 0) {
          // Remove current user from list if included. (Should only be possible if current user is admin.)
          this.groupNonMembers$ = this.groupNonMembers$.concat(users.filter(u => u.id !== this.userid));
          this.groupNonMembers_offset += users.length;
          // If less records received than asked for, must be end.
          if (users.length < this.groupNonMembers_count) {
            this.groupNonMembers_endOfContent = true;
          }
        } else {
          // No users returned. Must be at end.
          this.groupNonMembers_endOfContent = true;
        }
      }, (err) => {
        console.error('Group home get non-members Error:', err);
      });
  }





  // Todo...
  // Index for adding user to group. Used by add user modal.
  public addUserIndex = null;
  /**
   * Adds the specified user to the group.
   * @param index - index of user in groupNonMembers$ array.
   */
  public addUserToGroup(index): void {
    // Check valid.
    if (index < 0 || index >= this.groupNonMembers$.length) { return; }

    //todo - call add user method in groupService. Implement if needed.
    this.groupService.addMemberToGroup(this.group$.id, this.groupNonMembers$[index].id).subscribe((res) => {
      // Successful. Add user record to members list if appropriate.
      // List empty. Add.
      if (this.groupMembers$.length == 0) {
        this.groupMembers$.push(this.groupNonMembers$[index]);
        this.groupMembers_offset++;
      }
      // If id of added user is lower than id of last user in current members list.
      else if (this.groupMembers$[this.groupMembers$.length - 1].id  > this.groupNonMembers$[index].id) {
        // Add to end of list. Then sort by id.
        this.groupMembers$.push(this.groupNonMembers$[index]);
        this.groupMembers$.sort((a, b) => { return a.id - b.id; });
        this.groupMembers_offset++;
      }

      // Remove user from the non-members list.
      this.groupNonMembers$ = this.groupNonMembers$.filter((ele, i) => { return i !== index; });
      this.groupNonMembers_offset--;
    }, (err) => {
      console.error('Group home add user Error:', err);
    })
  }
  // *** End of Non-members methods ***





  /**
   * Removes the current user from the group, then redirects them to the group list.
   */
  public removeCurrentUserFromGroup(): void {
    this.groupService.removeMemberFromGroup(this.group$.id, this.userid).subscribe((res) => {
      // Successful. Redirect to group list.
      this.router.navigate([environment.routes.groupList]);
      return;
    }, (err) => {
      console.error('Group home remove self Error:', err);
    })
  }

  /**
   * Deletes group (admin only)
   */
  public deleteGroup(): void {
    // Check admin.
    if (!this.isAdmin) { return; }

    alert('Sorry. Admin group deletion is not fully implemented yet.\n(On the server-side at least...)');
  }





  // HTML methods.
  /**
   * Gets imageUrl from given group object. Returns placeholder if imageUrl is empty or invalid.
   * @param { imageUrl } - imageUrl attribute of given group object.
   */
  public getGroupImageUrl({ imageUrl }: Group): string {
    if (imageUrl == null || imageUrl == '') {
      return 'https://placehold.it/256x256';
    }
    return imageUrl;
  }


  /**
   * Gets the route of the user chat area for the specified user.
   * @param userid - id of user.
   */
  public getUserChatRoute(userid): string {
    return this.navService.getUserChatRoute(userid);
  }
}
