import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestQuestionsService } from 'src/app/services/contentServices/test-questions.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TestQuestion } from 'src/app/classes/TestQuestion';

@Component({
  selector: 'app-test-question-list',
  templateUrl: './test-question-list.component.html',
  styleUrls: ['./test-question-list.component.css']
})
export class TestQuestionListComponent implements OnInit {

  // Constants.
  private count = 10;
  private offset = 0;

  // Ids of parent objects.
  private subjectid = null;
  private topicid = null;
  private testid = null;

  private testQuestions$ = [];
  private endOfContent: boolean = false;


  constructor(
    private subjectService: SubjectsService,                // For setting current subject.
    private testQuestionService: TestQuestionsService,      // For interacting with test questions.
    private signIn: SignInService,                          // For getting user admin status.
    private route: ActivatedRoute,                          // For getting route parameters.
    private router: Router                                  // For redirecting user if not admin.
  ) { }

  ngOnInit() {
    // Get route parameters.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // If user is not an admin, redirect them to test home for corresponding test.
      if (!isAdmin) {
        this.redirectToTestHome();
      }
    }, (err) => {
      console.error('TestQuestion-List isAdmin Error:', err);
    });

    // Get test questions.
    this.getTestQuestion();
  }



  private onScroll() {
    console.log(this.endOfContent);
    if (!this.endOfContent) {
      this.getTestQuestion();
    }
  }

  /**
   * Attempt to get more test questions.
   * If successful, append them to end of testQuestions$ list.
   */
  private getTestQuestion(): void {
    this.testQuestionService.getTestQuestions(this.subjectid, this.topicid, this.testid, this.count, this.offset).subscribe((questions: TestQuestion[]) => {
      if (questions.length > 0) {
        this.testQuestions$ = this.testQuestions$.concat(questions);
        // Increment offset for when more questions are loaded.
        this.offset += questions.length;
      } else {
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('TestQuestions-List getTestQuestions Error:', err);
    });
  }





  /**
   * Redirects user to test home. (Based on current url parameters)
   */
  private redirectToTestHome(): void {
    let route = environment.routes.testHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.testid}`, this.testid);
    this.router.navigate([ route ]);
  }
}
