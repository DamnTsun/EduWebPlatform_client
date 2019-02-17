import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestQuestionsService } from 'src/app/services/contentServices/test-questions.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestQuestion } from 'src/app/classes/TestQuestion';
import { environment } from 'src/environments/environment';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-test-question-home',
  templateUrl: './test-question-home.component.html',
  styleUrls: ['./test-question-home.component.css']
})
export class TestQuestionHomeComponent implements OnInit {

  private subjectid = null;
  private topicid = null;
  private testid = null;
  private testQuestion$: TestQuestion = null;

  private loadingFailed: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private testQuestionService: TestQuestionsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    private navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);
    let questionid = this.route.snapshot.paramMap.get(environment.routeParams.questionId);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // If user is not admin, redirect to test home.
      if (!isAdmin) {
        this.redirectToTestHome();
      }
    }, (err) => {
      // Error. Redirect.
      console.error('TestQuestion-Home isAdmin Error:', err);
      this.redirectToTestHome();
    })


    // Get test question being viewed.
    this.testQuestionService.getTestQuestion(this.subjectid, this.topicid, this.testid, questionid).subscribe((questions: TestQuestion[]) => {
      if (questions !== null && questions.length > 0) {
        this.testQuestion$ = questions[0];
      }
    }, (err) => {
      console.error('TestQuestion-Home getQuestion Error:', err);
      this.loadingFailed = true;
    })
  }



  /**
   * Redirects user to test home.
   */
  private redirectToTestHome() {
    let route = environment.routes.testHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.testid}`, this.testid);
    this.router.navigate([ route ]);
  }





  /**
   * Deletes the question being viewed.
   */
  public deleteQuestion() {
    // Check currently viewing a question.
    if (this.testQuestion$ == null) { return; }

    this.testQuestionService.deleteTestQuestion(this.subjectid, this.topicid,
      this.testid, this.testQuestion$.id).subscribe((res) => {
        // Success. Redirect to test questions list.
        this.router.navigate([
          this.navService.getTestQuestionListRoute(this.subjectid, this.topicid, this.testid)
        ]);
    }, (err) => {
      console.error('TestQuestion-Home delete question Error:', err);
    })
  }
}
