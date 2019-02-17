import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/classes/Test';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-creator',
  templateUrl: './test-creator.component.html',
  styleUrls: ['./test-creator.component.css']
})
export class TestCreatorComponent implements OnInit {

  // Ids of parents / test being editted.
  private subjectid = null;
  private topicid = null;

  private submitted: boolean = false;       // Whether page has been submitted.
  private errorMessage: string = null;      // Error message to display if something goes wrong.

  // Value of name / description. Used by preview.
  public nameValue: string = '';
  public descriptionValue: string = '';





  constructor(
    private subjectService: SubjectsService,
    private testService: TestsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);

    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send to topic home if not admin.
      if (!isAdmin) {
        this.redirectToTopicHome();
      }
    }, (err) => {
      console.error('TestCreator isAdmin Error:', err);
    })


    // Watch values of name / description.
    document.getElementById('testName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('testDescription').addEventListener('input', (e) => {
      this.descriptionValue = (<HTMLTextAreaElement>e.target).value;
    });
  }


  /**
   * Validates inputs and creates test on API if valid.
   */
  private createTest(): void {
    // Get and validate test.
    let test = this.buildTest();
    if (test == null) { return; }

    // Submit if allowed.
    if (!this.submitted) {
      this.submitted = true;
      this.testService.createTest(this.subjectid, this.topicid, test).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }


  /**
   * Builds an object containing values for a test.
   * If valid, returns an object containing values.
   * Else returns null.
   */
  private buildTest(): object {
    let test = {
      name: null,
      description: null
    }

    // Name
    let name = <HTMLInputElement>document.getElementById('testName');
    if (name == null ||
        name.value.trim() == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    test.name = name.value.trim();

    // Description
    let description = <HTMLTextAreaElement>document.getElementById('testDescription');
    if (description == null) {
      return null;
    }
    test.description = description.value.trim();

    return test;
  }



  // Handlers for main api request. (create test)
  private handleSuccess = (res) => {
    // Redirect to home area of new test.
    let route = environment.routes.testHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.testid}`, res[0].id);
    this.router.navigate([ route ]);
  }

  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // User inputted something wrong.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 401: // User isn't an admin.
        this.redirectToTopicHome();
        break;
      case 500: // Something went wrong with server.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;
      
      default:  // Unexpected error.
        console.error('TestCreator unknown error:', err);
        break;
    }
  }





  private redirectToTopicHome() {
    let route = environment.routes.topicHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    this.router.navigate([ route ]);
  }
}
