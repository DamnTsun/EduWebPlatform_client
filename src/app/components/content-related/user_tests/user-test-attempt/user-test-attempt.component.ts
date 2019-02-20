import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { SignInService } from 'src/app/services/sign-in.service';
import { TestQuestion } from 'src/app/classes/TestQuestion';
import { UserTest } from 'src/app/classes/UserTest';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { UserTestsService } from 'src/app/services/user/user-tests.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-user-test-attempt',
  templateUrl: './user-test-attempt.component.html',
  styleUrls: ['./user-test-attempt.component.css']
})
export class UserTestAttemptComponent implements OnInit {

  // Id of test that this user_test is based off.
  private subjectid = null;
  private topicid = null;
  private testid = null;
  // Test questions for user_test.
  private testQuestions$: TestQuestion[] = null;
  // Whether a loading error has occurred.
  private loadingError: boolean = false;
  // Whether the user_test has been submitted successfully.
  private hasSubmitted: boolean = false;

  public errorMessage: string = null;





  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private userTestsService: UserTestsService,
    private signIn: SignInService,
    private utilService: UtilService,
    private navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Get params from url.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Check user is signed in.
    this.signIn.user().subscribe((user) => {
      if (user === null) {
        this.redirectToTestHome();
      }
    });

    // Validate count parameter. Must be integer, between 1 and 50.
    let count: number = Number(this.route.snapshot.paramMap.get('count'));
    if (isNaN(count) || count < 1 || count > 50) {
      // Not valid. Redirect back to test home.
      this.redirectToTestHome();
    }


    // Get questions for test from API.
    this.userTestsService.getUserTestQuestions(this.subjectid, this.topicid, this.testid, count).subscribe((testQuestions) => {
      this.testQuestions$ = testQuestions;
    }, (err) => {
      this.loadingError = true;
      console.error('User_test Questions Error:', err);
    })
  }

  /**
   * Redirects user back to test home, if something wasn't valid.
   */
  private redirectToTestHome(): void {
    // Get params from url.
    let testRoute = environment.routes.testHome;
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    testRoute = testRoute.replace(`:${environment.routeParams.subjectid}`, subjectid);
    testRoute = testRoute.replace(`:${environment.routeParams.topicid}`, topicid);
    testRoute = testRoute.replace(`:${environment.routeParams.testid}`, testid);
    this.router.navigate([testRoute]);
  }



  /**
   * Sends users answers and the test name to API to be saved.
   * Will validate inputs first, and do nothing if any inputs are invalid.
   */
  private submitQuestions(): void {
    // Get user inputs. Ensure valid.
    let user_test = this.constructUserTest();
    if (user_test == null) { return; }

    // If test has not be submitted. Submit it and prevent future submits.
    if (!this.hasSubmitted) {
      // Send the user test to the api.
      this.hasSubmitted = true;
      this.sendUserTest(user_test);
    }
  }



  /**
   * Constructs and returns JSON object for sending to API.
   * Object will be a user_test.
   * Will return null if any inputs are invalid.
   */
  private constructUserTest(): object {
    let user_test = {
      title: null,
      test_id: null,
      questions: []
    };
    // Get and validate user_test name.
    let name = <HTMLInputElement>document.getElementById('ut_name');
    if (name == null) { return null; }
    if (name.value == null) { return null; }
    user_test.title = name.value;
    // If name is '', replace with current time.
    user_test.title = this.utilService.getIsoTimeFormatted(new Date(new Date().getTime()));

    // Get testid as number.
    let testidNumber = Number(this.testid);
    if (isNaN(testidNumber)) { return null; }
    user_test.test_id = testidNumber;

    // Get each question id and answer.
    this.testQuestions$.forEach(tq => {
      // Get the input field for question. Check value given.
      let input = <HTMLInputElement>document.getElementById(`question${tq.id}`);
      if (input.value == null) { return null; }
      // Add the id and user answer.
      user_test.questions.push({
        id: tq.id,
        answer: input.value.trim()
      });
    });

    return user_test;
  }



  /**
   * Sends given user_test object to API and handles response.
   * @param user_test - user_test object.
   */
  private sendUserTest(user_test): void {
    this.userTestsService.addUserTest(this.subjectid, this.topicid, this.testid, user_test).subscribe((res) => {
      // Submitted successfully. Redirect to user_test page for this test.
      this.router.navigate([
        this.navService.getUserTestDetailsRoute(this.subjectid, this.topicid, this.testid, res[0].id)
      ]);
    }, (err) => {
      console.error('Add User_Test Error:', err);
    })
  }
}
