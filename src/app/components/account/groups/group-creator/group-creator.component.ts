import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/services/group/group.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-group-creator',
  templateUrl: './group-creator.component.html',
  styleUrls: ['./group-creator.component.css']
})
export class GroupCreatorComponent implements OnInit {

  public submitted: boolean = false;       // Whether form has or is in process of being submitted.
  public errorMessage: string = null;       // Error message if something goes wrong.

  // Current name / description / imageUrl of group. Used by preview.
  public nameValue: string = '';
  public descriptionValue: string = '';
  public imageUrlValue: string = '';
  public imageUrlValid: boolean = true;





  constructor(
    private groupService: GroupService,
    private signIn: SignInService,
    private router: Router,
    public navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Check user is signed in.
    this.signIn.userInternalRecord().subscribe((user) => {
      // Redirect to sign in if not signed in.
      if (user === null) {
        this.router.navigate([environment.routes.account_signIn]);
      }
    }, (err) => {
      console.error('GroupCreator get user status Error:', err);
    });


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
   * Validates inputs and creates a group on api if valid.
   */
  public createGroup(): void {
    // Get and validate group.
    let group = this.buildGroup();
    if (group === null) { return; }
    if (!this.imageUrlValid) {
      return;
    }

    // If page has not been submitted.
    if (!this.submitted) {
      this.submitted = true;
      this.groupService.createGroup(group).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  /**
   * Attempts to build object containing values for group.
   * Returns null if any values are invalid.
   */
  private buildGroup(): object {
    let group = {
      name: null,
      description: null,
      imageUrl: null
    };

    // Name
    let nameInput = <HTMLInputElement>document.getElementById('groupName');
    if (nameInput == null ||
      nameInput.value == null ||
      nameInput.value.trim() === '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    group.name = nameInput.value.trim();


    // Description
    let descriptionInput = <HTMLTextAreaElement>document.getElementById('groupDescription');
    if (descriptionInput == null ||
      descriptionInput.value == null) {
      return null;
    }
    group.description = descriptionInput.value.trim();


    // ImageUrl
    let imageUrlInput = <HTMLInputElement>document.getElementById('groupImageUrl');
    if (imageUrlInput == null ||
      imageUrlInput.value == null) {
      return null;
    }
    group.imageUrl = imageUrlInput.value.trim();


    return group;
  }


  // Handlers for api request.
  // Successful request.
  private handleSuccess = (res) => {
    // Success. Redirect to group list.
    this.router.navigate([this.navService.getGroupHomeRoute(res[0].id)]);
  }

  // Failed request.
  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // Bad request.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 500: // Internal server error.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;
      default:
        console.error('GroupCreator unexpected Error:', err);
        break;
    }
  }
}
