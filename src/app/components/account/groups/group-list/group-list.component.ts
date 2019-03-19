import { Component, OnInit } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { GroupService } from 'src/app/services/group/group.service';
import { environment } from 'src/environments/environment';
import { Group } from 'src/app/classes/Group';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  // For keeping track of current position in api data.
  private count = 18;
  private offset = 0;
  public endOfContent: boolean = false;
  public groups$: Group[] = [];

  private allGroupsCount = 18;
  private allGroupsOffset = 0;
  public allGroupsEndOfContent: boolean = false;
  public allGroups$: Group[] = [];

  public viewAllGroups: boolean = false;


  // Userid and admin status.
  public userid = null;
  public isAdmin: boolean = false;





  constructor(
    private signIn: SignInService,                  // For getting user signed in / admin status.
    private groupService: GroupService,             // For interacting with groups on api.
    private router: Router,                         // For redirecting user if necessary.
    public navService: NavigationServiceService    // Helps getting routes for redirects.
  ) { }

  ngOnInit() {
    // Check user signed in. Get their id.
    this.signIn.userInternalRecord().subscribe((user) => {
      // Not signed in. Redirect to sign in.
      if (user == null) {
        this.router.navigate([ environment.routes.account_signIn ]);
        return;
      }
      this.userid = user[0].id;
    }, (err) => {
      console.error('Groups list get user details Error:', err);
    });


    // Check if user is admin. Store findings.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
      // If user is admin, get the initial groups to show for all groups section.
      if (this.isAdmin) {
        this.getAllGroups();
      }
    }, (err) => {
      console.error('Groups list get user admin status Error:', err);
    });


    // Get initial groups to show.
    if (this.userid !== null) {
      this.getGroups();
    }
  }





  /**
   * Scroll event for infinite scroll.
   */
  public onScroll(): void {
    // If getting 'my groups'.
    if (!this.viewAllGroups || !this.isAdmin) {
      if (!this.endOfContent) {
        this.getGroups();
      }
    }
    // If getting all groups (admin-only)
    if (this.isAdmin && this.viewAllGroups) {
      if (!this.allGroupsEndOfContent) {
        this.getAllGroups();
      }
    }
  }


  /**
   * Attempts to get groups from api based on count and offset values.
   */
  private getGroups() {
    this.groupService.getGroups(this.count, this.offset).subscribe((groups: Group[]) => {
      // Check any groups received.
      if (groups.length > 0) {
        this.groups$ = this.groups$.concat(groups);
        this.offset += groups.length;
        // If less groups received than asked for, must be end of content.
        if (groups.length < this.count) {
          this.endOfContent = true;
        }
      } else {
        // No groups received. End of groups.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Groups list get groups Error:', err);
    });
  }


  /**
   * Attemps to get groups from API based on count and offset values.
   * Gets all groups, not just groups the user is in.
   * Is admin only.
   */
  private getAllGroups() {
    this.groupService.getAllGroups(this.allGroupsCount, this.allGroupsOffset)
    .subscribe((groups: Group[]) => {
      // Check any groups received.
      if (groups.length > 0) {
        this.allGroups$ = this.allGroups$.concat(groups);
        this.allGroupsOffset += groups.length;
      } else {
        // Not groups received. At end of content.
        this.allGroupsEndOfContent = true;
      }
    }, (err) => {
      console.error('Groups list get all groups Error:', err);
    })
  }




  // HTML methods.
  /**
   * Gets groups to show.
   * Either my groups or all groups (admin only)
   */
  public getGroupsToShow(): Group[] {
    if (!this.viewAllGroups) { 
      return this.groups$;
    }
    if (this.viewAllGroups && this.isAdmin) { 
      return this.allGroups$;
    }
    return [];
  }

  /**
   * Gets title for page based on where my groups or all groups are being viewed.
   */
  public getTitle(): string {
    if (!this.viewAllGroups) {
      return 'My Groups';
    }
    if (this.viewAllGroups) {
      return 'All Groups';
    }
    return 'An error has occured.';
  }

  public getGroupImageUrl(group: Group): string {
    // If group or imageUrl is invalid, return placeholder.
    if (group == null || group.imageUrl == null || group.imageUrl == '') {
      return 'https://placehold.it/256x256';
    }
    return group.imageUrl;
  }


  
  // Index of group to be left. Used by leave group modal.
  public leaveGroupIndex = null;
  /**
   * Removes current user from specified group (by index).
   * If given index is valid.
   * @param index - index of group to leave in groups$ array.
   */
  public leaveGroup(index) {
    // Check index valid.
    if (index == null) { return; }
    if (index < 0 || index >= this.groups$.length) { return; }
    // Remove from group.
    this.groupService.removeMemberFromGroup(this.groups$[index].id, this.userid)
    .subscribe((res) => {
      // Success. Remove group from my groups list.
      this.groups$ = this.groups$.filter((g, i) => { return i !== index; });
    }, (err) => {
      console.error('Group list leave group Error:', err);
    })
  }
}
