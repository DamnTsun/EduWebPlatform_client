import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-editor',
  templateUrl: './test-editor.component.html',
  styleUrls: ['./test-editor.component.css']
})
export class TestEditorComponent implements OnInit {

  // Ids of parents / test being editted.
  private subjectid = null;
  private topicid = null;
  private test$ = null;

  private submitted: boolean = false;       // Whether form has been submitted.
  private errorMessage: string = null;      // Error message to display if something goes wrong.


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
    let testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // If user not admin, redirect to topic home.
      if (!isAdmin) {
        //this.redirectToTopicHome();
      }
    }, (err) => {
      console.error('Test-Editor isAdmin Error:', err);
    });


    // Get test being editted.
    this.testService.getTest(this.subjectid, this.topicid, testid).subscribe((tests) => {
      if (tests !== null && tests.length > 0) {
        this.test$ = tests[0];
        this.setPageValues(this.test$);
      }
    }, (err) => {
      console.error('Test-Editor test Error:', err);
    });
  }



  /**
   * Sets values on page based on given test object.
   * @param test - test object.
   */
  private setPageValues(test): void {
    // Name.
    let name = <HTMLInputElement>document.getElementById('testName');
    if (name !== null) { name.value = test.name; }

    // Description.
    let description = <HTMLTextAreaElement>document.getElementById('testDescription');
    if (description !== null) { description.value = test.description; }
  }

  /**
   * Resets values on page back to originals.
   */
  private resetValues(): void {
    if (this.test$ !== null) {
      this.setPageValues(this.test$);
    }
  }



  /**
   * Validates inputs and updates test on api if valid.
   */
  private editTest(): void {
    let test = this.buildTest();
    if (test == null) { return; }
    if (Object.keys(test).length == 0) {
      this.errorMessage = 'You have not changed any values.';
      return null;
    }

    // Submit if allowed.
    if (!this.submitted) {
      this.submitted = true;
      this.testService.editTest(this.subjectid, this.topicid, this.test$.id, test).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  /**
   * Builds test object for sending to api.
   * If inputs are valid, object will be returned.
   *  May return object with no attributes if no values are changed.
   * Else will return null.
   */
  private buildTest(): object {
    let test = {};

    // Name
    let name = <HTMLInputElement>document.getElementById('testName');
    if (name == null) { return null; }
    if (name.value.trim() == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    if (name.value.trim() !== this.test$.name) {
      test['name'] = name.value.trim();
    }

    // Description
    let description = <HTMLTextAreaElement>document.getElementById('testDescription');
    if (description == null) { return null; }
    if (description.value.trim() !== this.test$.description) {
      test['description'] = description.value.trim();
    }

    this.errorMessage = null;
    return test;
  }



  // Handlers for main api request (edit test)
  private handleSuccess = (res) => {
    // Redirect to test home for editted test.
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
      case 401: // User not admin.
        this.redirectToTopicHome();
        break;
      case 500: // Server messed up.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;

      default:  // Unknown error.
        console.error('Test-Editor unknown error:', err);
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
