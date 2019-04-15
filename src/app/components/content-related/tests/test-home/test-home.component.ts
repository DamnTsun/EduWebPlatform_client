import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/classes/Test';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

import { UserTestListComponent } from 'src/app/components/content-related/user_tests/user-test-list/user-test-list.component';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-test-home',
  templateUrl: './test-home.component.html',
  styleUrls: ['./test-home.component.css']
})
export class TestHomeComponent implements OnInit {

  public subjectid = null;
  public topicid = null;

  public test$: Test = null;
  public loadingError: boolean = false;
  public user = null;
  public isAdmin: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private testService: TestsService,
    private signIn: SignInService,
    public navService: NavigationServiceService,
    public util: UtilService
  ) { }

  ngOnInit() {
    // Get ids from url.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    // Set subject id in site service based on url parameter.
    this.subjectService.setSubject(this.subjectid);


    // Get user signed in status.
    this.signIn.userInternalRecord().subscribe((user) => {
      this.user = user;
    }, (err) => {
      console.error('Test-Home user error:', err);
    })

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Test-Home isAdmin Error:', err);
    })


    // Get test from api.
    this.testService.getTest(this.subjectid, this.topicid, testid).subscribe((tests) => {
      this.test$ = tests[0];
      // Set max number for custom question count modal.
      (<HTMLInputElement>document.getElementById('utq_numberinput')).max = this.test$.testQuestionCount.toString();
    }, (err) => {
      this.loadingError = true;
      console.error('TestHome test$ Error:', err);
      this.router.navigate([this.navService.getSubjectListRoute()]);
    });
  }



  /**
   * Sends the user to the user tests area, with the desired number of questions.
   */
  public generateTest(numberOfQuestions: number) {
    // Get url params.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    // Get user_test url and add in url params.
    let url = environment.routes.userTestAttempt;
    url = url.replace(`:${environment.routeParams.subjectid}`, subjectid);
    url = url.replace(`:${environment.routeParams.topicid}`, topicid);
    url = url.replace(`:${environment.routeParams.testid}`, testid);
    // Change to user_tests page, passing desired number of questions.
    this.router.navigate([url, { count: numberOfQuestions }]);
  }

  /**
   * Generates a test with a custom question count.
   * Gets and validates given question count.
   */
  public generateTestCustom(count: number) {
    // Ensure count if number type. (not string...)
    count = Number.parseInt(count.toString());
    // Check count is a number, is 1 or greater, is not greater than test question pool size.
    if (count !== null && count >= 1 && count <= this.test$.testQuestionCount) {
      this.generateTest(count);
    }
  }





  /**
   * Shows user previous user tests from all time.
   */
  public viewPreviousUserTests_allTime() {
    this.viewPreviousUserTests(UserTestListComponent.TIMESPANS.ALL_TIME);
  }

  /**
   * Shows user previous user tests from last month.
   */
  public viewPreviousUserTests_month() {
    this.viewPreviousUserTests(UserTestListComponent.TIMESPANS.MONTH);
  }

  /**
   * Redirects user to the previous user tests page.
   * Optionally can specify the timespan parameter.
   * @param timespan - Timespan to get user tests over, e.g. month.
   */
  private viewPreviousUserTests(timespan: string = null) {
    let params: object = {};
    if (timespan != null) {
      params['timespan'] = timespan;
    }
    this.router.navigate(
      [
        this.navService.getUserTestListRoute(
          this.subjectid, this.topicid, this.test$.id),
        params
      ]
    );
  }



  

  // HTML methods
  /**
   * Changes value of questionCountInput of custom question count modal by an amount.
   * @param increment - amount of change value. (typically +1 / -1)
   */
  public incrementCustomQuestionCount(increment: number) {
    // Get value as number, check it is a number.
    let value = Number.parseInt((<HTMLInputElement>document.getElementById('utq_numberinput')).value);
    if (value !== null) {
      value += increment;
      // Set new value if it is valid.
      if (value >= 1 && value <= this.test$.testQuestionCount) {
        (<HTMLInputElement>document.getElementById('utq_numberinput')).value = value.toString();
      }
    }
  }
}
