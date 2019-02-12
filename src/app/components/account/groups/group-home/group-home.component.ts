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
  public group$: Group = null;
  public groupLoadingError: boolean = false;

  // Members in group.
  public groupMembers$ = [];
  private count = 18;
  private offset = 0;
  public endOfContent: boolean = false;




  constructor(
    private signIn: SignInService,                  // For getting user signed in / admin status.
    private groupService: GroupService,             // For interacting with groups on api.
    private route: ActivatedRoute,                  // For getting route params.
    private router: Router,                         // For redirecting user if necessary.
    private navService: NavigationServiceService    // For getting routes for redirects.
  ) { }

  ngOnInit() {
    // Get route params.
    let groupid = this.route.snapshot.paramMap.get(environment.routeParams.groupid);


    // Check user signed in.
    this.signIn.userInternalRecord().subscribe((user) => {
      // If user not signed in, redirect to sign in.
      if (user == null) {
        this.router.navigate([ environment.routes.account_signIn ]);
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
    this.groupService.getGroup(groupid).subscribe((group: Group[]) => {
      this.group$ = group[0];
      // After getting group, get members of group. (initial)
      this.getGroupMembers();
    }, (err) => {
      console.error('Group home get group Error:', err);
      this.groupLoadingError = true;
    });
  }




  /**
   * Scroll event for infinite scroll.
   */
  public onScroll() {
    if (!this.endOfContent) {
      this.getGroupMembers();
    }
  }

  /**
   * Attempts to get group members from api.
   */
  private getGroupMembers(): void {
    this.groupService.getGroupMembers(this.group$.id, this.count, this.offset).subscribe((members: User[]) => {
      if (members.length > 0) {
        // Remove current user from list if included.
        this.groupMembers$ = this.groupMembers$.concat(members.filter(u => u.id !== this.userid));
        this.offset += members.length;
        // If less records received than asked for, must be end.
        if (members.length < this.count) {
          this.endOfContent = true;
        }
      } else {
        // No records received. Must be end.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Group home get members Error:', err);
    });
  }





  // ADD / REMOVE users from group.
  // Index of user to be removed from group. Used by remove user modal.
  public removeUserIndex = null;
  /**
   * Removes the specified user from the group.
   * @param index - index of user in groupMemebers$ array.
   */
  public removeUserFromGroup(index) {
    // Check index.
    if (index < 0 || index >= this.groupMembers$.length) { return; }

    this.groupService.removeMemberFromGroup(this.group$.id, this.groupMembers$[index].id).subscribe((res) => {
      // Successful. Remove user from list.
      this.groupMembers$ = this.groupMembers$.filter((ele, i) => { return i !== index; });
    }, (err) => {
      console.error('Group home remove user Error:', err);
    });
  }

  /**
   * Removes the current user from the group, then redirects them to the group list.
   */
  public removeCurrentUserFromGroup() {
    this.groupService.removeMemberFromGroup(this.group$.id, this.userid).subscribe((res) => {
      // Successful. Redirect to group list.
      this.router.navigate([ environment.routes.groupList ]);
      return;
    }, (err) => {
      console.error('Group home remove self Error:', err);
    })
  }



  /**
   * Deletes group (admin only)
   */
  public deleteGroup() {
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
  public getUserChatRoute(userid) {
    return this.navService.getUserChatRoute(userid);
  }
}
