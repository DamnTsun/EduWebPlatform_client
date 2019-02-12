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
  private endOfContent: boolean = false;
  private groups$: Group[] = [];


  // Userid and admin status.
  private userid = null;
  private isAdmin: boolean = false;





  constructor(
    private signIn: SignInService,                  // For getting user signed in / admin status.
    private groupService: GroupService,             // For interacting with groups on api.
    private router: Router,                         // For redirecting user if necessary.
    private navService: NavigationServiceService    // Helps getting routes for redirects.
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
    if (!this.endOfContent) {
      this.getGroups();
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




  // HTML methods.
  public getGroupImageUrl(group: Group): string {
    // If group or imageUrl is invalid, return placeholder.
    if (group == null || group.imageUrl == null || group.imageUrl == '') {
      return 'https://placehold.it/256x256';
    }
    return group.imageUrl;
  }
}
