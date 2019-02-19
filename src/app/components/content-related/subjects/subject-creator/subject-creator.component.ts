import { Component, OnInit, NgZone } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-subject-creator',
  templateUrl: './subject-creator.component.html',
  styleUrls: ['./subject-creator.component.css']
})
export class SubjectCreatorComponent implements OnInit {

  private submitted: boolean = false;     // Whether user has submitted subject.
  private errorMessage: string = null;    // Error message to display if something goes wrong.

  // Holds current values. Used by preview.
  public nameValue: string = '';
  public descriptionValue: string = '';





  constructor(
    private subjectService: SubjectsService,
    private signIn: SignInService,
    private router: Router,
    public navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Subscribe to user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Kick back to subject select if not an admin.
      if (!isAdmin) {
        this.router.navigate([ environment.routes.subjectSelect ]);
      }
    }, (err) => {
      console.error('Subject-Creator isAdmin Error:', err);
    });


    // Subscribe to updates to name / description input.
    document.getElementById('subjectName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('subjectDescription').addEventListener('input', (e) => {
      this.descriptionValue = (<HTMLTextAreaElement>e.target).value;
    });
  }



  /**
   * Validates inputs and sends request to API to create a subject.
   */
  private createSubject(): void {
    // Get subject, ensure valid.
    let subject = this.buildSubject();
    if (subject === null) { return; }
  
    // If page hasn't been submitted.
    if (!this.submitted) {
      this.submitted = true;
      this.subjectService.createSubject(subject)
        .subscribe(this.handleSuccess, this.handleError);
    }
  }

  /**
   * Attempts to build subject object for sending to API.
   * If successful, will return the constructed subject object.
   * Else will return null.
   */
  private buildSubject(): object {
    let subject = {
      name: null,
      description: null
    }

    // Attempt to get name input.
    let nameInput = <HTMLInputElement>document.getElementById('subjectName');
    if (nameInput == null ||
        nameInput.value == null ||
        nameInput.value.trim() == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    subject.name = nameInput.value.trim();

    // Attempt to get description input.
    let descriptionInput = <HTMLTextAreaElement>document.getElementById('subjectDescription');
    if (descriptionInput == null) { return null; }
    if (descriptionInput.value == null) { return null; }
    subject.description = descriptionInput.value.trim();

    return subject;
  }



  // They need to be vars not methods because JavaScript logic.
  // Success handler for api request.
  private handleSuccess = (res) => {
    // Redirect to newly created subjects home area. (subjects/:id)
    let route = environment.routes.subjectHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, res[0].id);
    this.router.navigate([ route ]);
  }

  // Error handler for api request.
  private handleError = (err) => {
    // Depends on HTTP code received.
    switch (err.status) {
      // Bad request. User did something wrong.
      case 400:
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      // Internal server error. Something went wrong serverside.
      case 500:
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;


      // Unexpected error.
      default:
        console.error('Subject-Creator createSubject Error:', err);
        break;
    }
  }
}
