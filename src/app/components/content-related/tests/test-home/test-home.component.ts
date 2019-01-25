import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/classes/Test';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-test-home',
  templateUrl: './test-home.component.html',
  styleUrls: ['./test-home.component.css']
})
export class TestHomeComponent implements OnInit {

  private test$: Test = null;
  private loadingError: boolean = false;
  private user = null;
  private isAdmin: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private testService: TestsService,
    private signIn: SignInService
  ) { }

  ngOnInit() {
    // Get ids from url.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    // Set subject id in site service based on url parameter.
    this.subjectService.setSubject(subjectid);


    // Get user signed in status.
    this.signIn.userInternalRecord().subscribe((user) => {
      console.log(user);
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
    this.testService.getTest(subjectid, topicid, testid).subscribe((tests) => {
      this.test$ = tests[0];
    }, (err) => {
      this.loadingError = true;
      console.error('TestHome test$ Error:', err);
    });
  }



  /**
   * Generates test with 5 questions
   */
  private generateTest5() {
    this.generateTest(5);
  }
  /**
   * Generates test with 10 questions
   */
  private generateTest10() {
    this.generateTest(10);
  }
  /**
   * Generates test with 25 questions
   */
  private generateTest25() {
    this.generateTest(25);
  }



  /**
   * Sends the user to the user tests area, with the desired number of questions.
   */
  private generateTest(numberOfQuestions: number) {
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
    this.router.navigate([ url, { count: numberOfQuestions } ]);
  }

  /**
   * Generates a test with a custom question count.
   * Gets and validates given question count.
   */
  private generateTestCustom(count: number) {
    // Validate number of questions.
    if (count >= 1 && count <= 50) {
      console.log('valid');
    }


    // go to: /user_test/n where n is question count.
  }
}
