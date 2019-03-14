import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { UserTestsService } from 'src/app/services/user/user-tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { environment } from 'src/environments/environment';
import { UserTestQuestion } from 'src/app/classes/UserTestQuestion';
import { UserTest } from 'src/app/classes/UserTest';
import { UserTestListComponent } from '../user-test-list/user-test-list.component';

@Component({
  selector: 'app-user-test-details',
  templateUrl: './user-test-details.component.html',
  styleUrls: ['./user-test-details.component.css']
})
export class UserTestDetailsComponent implements OnInit {

  // Holds timespan of user test list if set.
  /* Stored so that timespan value is not lost when navigating back to
      the user tests list via breadcrumb navigation. */
  public timespan: string = null;

  // Ids of parent objects.
  public subjectid = null;
  public topicid = null;
  public testid = null;
  public utestid = null;

  public usertest$: UserTest = null;
  public utestQuestions: UserTestQuestion[] = [];





  constructor(
    private subjectService: SubjectsService,      // For setting subject.
    private userTestService: UserTestsService,    // For getting user test questions.
    private signIn: SignInService,                // For checking user is signed in.
    private route: ActivatedRoute,                // For getting route params.
    private router: Router,                       // For redirect user if needed.
    public navService: NavigationServiceService  // For getting routes for redirects.
  ) { }

  ngOnInit() {
    // Get route parameters.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);
    this.utestid = this.route.snapshot.paramMap.get(environment.routeParams.usertestid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get timespan param if set.
    this.timespan = this.route.snapshot.paramMap.get('timespan');
    if (UserTestListComponent.validateTimespanValue(this.timespan)) {
      this.timespan = null;
    }


    // Get user signed in
    this.signIn.user().subscribe((user) => {
      // If not signed in, redirect to test home.
      if (user == null) {
        this.router.navigate([
          this.navService.getTestHomeRoute(
            this.subjectid, this.topicid, this.testid
          )
        ]);
      }
    }, (err) => {
      console.error('UserTestDetails sign in Error:', err);
    });


    // Get user test being viewed.
    this.userTestService.getUserTestResult(
      this.subjectid, this.topicid, this.testid, this.utestid)
      .subscribe((utest: UserTest[]) => {
        this.usertest$ = utest[0];
      }, (err) => {
        console.error('UserTestDetails getUserTest Error:', err);
      });


    // Get individual questions of user test. (all questions)
    this.userTestService.getUserTestQuestionResults(
      this.subjectid, this.topicid, this.testid, this.utestid)
      .subscribe((questions: UserTestQuestion[]) => {
        this.utestQuestions = questions;
      }, (err) => {
        console.error('UserTestDetails getQuestions Error:', err);
      })
  }



  /**
   * Gets number of test question results where the user has chosen the correct answer.
   */
  public getCorrectQuestionCount(): number {
    return this.utestQuestions.reduce((acc, { userAnswer, correctAnswer }) => {
      if (userAnswer == correctAnswer) { return acc + 1; }
      return acc;
    }, 0);
  }

  /**
   * Gets percentage of questions that are correct.
   */
  public getCorrectQuestionPercentage(): number {
    // Get correct count.
    return Math.floor((this.usertest$.score / this.usertest$.questionCount) * 100);
  }


  /**
   * Deletes this user test and redirects user to user test list.
   */
  public deleteUserTest() {
    // Attempt to delete.
    this.userTestService.deleteUserTest(this.subjectid, this.topicid, this.testid, this.utestid)
      .subscribe((res) => {
        // Successful. Redirect to user test list.
        this.router.navigate([
          this.navService.getUserTestListRoute(this.subjectid, this.topicid, this.testid)
        ])
    }, (err) => {
      console.error('UserTestDetails delete user test Error:', err);
    });
  }





  // HTML methods
  /**
   * Get url parameter object for when navigating to user tests list via breadcrumb nav.
   */
  public getTimespanParamForNavigation(): Object {
    let params = {};
    if (this.timespan !== null) { params['timespan'] = this.timespan; }
    return params;
  }

  /**
   * Gets class for the score badge.
   */
  public getScoreContainerClass(): string {
    let score = this.getCorrectQuestionPercentage();
    if (score == 100) {
      return 'badge-primary';
    } else if (score > 70) {
      return 'badge-success';
    } else if (score > 60) {
      return 'badge-success';
    } else if (score > 50) {
      return 'badge-warning';
    } else {
      return 'badge-danger';
    }
  }

  /**
   * Gets feedback message for the score badge.
   */
  public getScoreFeedbackMessage(): string {
    let score = this.getCorrectQuestionPercentage();
    if (score == 100) {
      return 'Perfect! (100%)';
    } else if (score > 70) {
      return 'Excellent! (70+%)';
    } else if (score > 60) {
      return 'Great! (>60+%)';
    } else if (score > 50) {
      return 'Satisfactory. (50+%)';
    } else {
      return 'Needs Improvement! (Sub 50%)';
    }
  }
}
