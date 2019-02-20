import { Component, OnInit } from '@angular/core';
import { Group } from 'src/app/classes/Group';
import { GroupService } from 'src/app/services/group/group.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.css']
})
export class GroupEditorComponent implements OnInit {

  public submitted: boolean = false;      // Whether page has or is in process of being submitted.
  public errorMessage: string = null;     // Error message if something goes wrong.
  public groupid = null;
  private group$: Group = null;           // Hold group being editted.

  // Current values of inputs.
  public nameValue: string = '';
  public descriptionValue: string = '';
  public imageUrlValue: string = '';
  public imageUrlValid: boolean = true;





  constructor(
    private groupService: GroupService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    public navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Get route params.
    this.groupid = this.route.snapshot.paramMap.get(environment.routeParams.groupid);


    // Get user signed in status.
    this.signIn.userInternalRecord().subscribe((user) => {
      // Redirect to sign in if not signed in.
      if (user === null) {
        this.router.navigate([environment.routes.account_signIn]);
      }
    }, (err) => {
      console.error('GroupEditor user status Error:', err);
    });


    // Get group being editted.
    this.groupService.getGroup(this.groupid).subscribe((group: Group[]) => {
      this.group$ = group[0];
      this.setPageValues(this.group$);
    }, (err) => {
      console.error('GroupEditor get group Error:', err);
    });


    // Watch values of inputs.
    // Watch form values for preview.
    document.getElementById('groupName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('groupDescription').addEventListener('input', (e) => {
      this.descriptionValue = (<HTMLTextAreaElement>e.target).value;
    });
    document.getElementById('groupImageUrl').addEventListener('input', (e) => {
      this.imageUrlValue = (<HTMLInputElement>e.target).value.trim();
      // Check if current value is valid.
      if (this.imageUrlValue !== '') {
        let img = new Image();
        img.src = this.imageUrlValue;
        img.onload = () => { this.imageUrlValid = true; }
        img.onerror = () => { this.imageUrlValid = false; }
      } else {
        // If blank, set to valid.
        this.imageUrlValid = true;
      }
    });
  }

  /**
   * Sets current values on inputs based on given object.
   * @param group - object containing current values of group.
   */
  private setPageValues(group: Group): void {
    // Name.
    let name = <HTMLInputElement>document.getElementById('groupName');
    if (name !== null) { name.value = group.name; }
    this.nameValue = group.name;

    // Description.
    let description = <HTMLTextAreaElement>document.getElementById('groupDescription');
    if (description !== null) { description.value = group.description; }
    this.descriptionValue = group.description;

    // Image url.
    let imageUrl = <HTMLInputElement>document.getElementById('groupImageUrl');
    if (imageUrl !== null) { imageUrl.value = group.imageUrl; }
    this.imageUrlValue = group.imageUrl;
  }


  /**
   * Resets field values to initial values. (Based on currently stored group object)
   */
  private resetValues(): void {
    if (this.group$ !== null) {
      this.setPageValues(this.group$);
    }
  }


  /**
   * Validates inputs and sends request to api to edit group.
   */
  public editGroup(): void {
    let group = this.buildGroup();
    if (group == null) { return; }
    if (Object.keys(group).length == 0) {
      this.errorMessage = 'You have not changed any values.';
      return;
    }

    // Submit if able.
    if (!this.submitted) {
      this.submitted = true;
      this.groupService.editGroup(this.group$.id, group).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }


  /**
   * Builds object containing new values for group.
   * Will return {} is no values have changed.
   */
  private buildGroup(): object {
    let group = {};
    // Name
    let name = (<HTMLInputElement>document.getElementById('groupName')).value;
    if (name === '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    // Add if name is different.
    if (name !== this.group$.name) {
      group['name'] = name;
    }


    // Description
    let description = (<HTMLTextAreaElement>document.getElementById('groupDescription')).value;
    if (description !== this.group$.description) {
      group['description'] = description;
    }

    // Image url
    let imageUrl = (<HTMLInputElement>document.getElementById('groupImageUrl')).value;
    if (imageUrl !== this.group$.imageUrl) {
      group['imageUrl'] = imageUrl;
    }


    return group;
  }


  // Event handlers for api request.
  // On success.
  private handleSuccess = (res) => {
    // Success. Redirect to group home.
    this.router.navigate([this.navService.getGroupHomeRoute(this.group$.id)]);
  }

  // On fail.
  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // Bad request.
        this.errorMessage = err.error.message;
        break;
      case 500: // Internal server error.
        this.errorMessage = 'Something went wrong with the server. Please try again later.';
        break;
      default: // Unknown error.
        console.error('GroupEditor unknown Error:', err);
        break;
    }
  }
}
