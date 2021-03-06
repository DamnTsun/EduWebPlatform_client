import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestQuestionsService } from 'src/app/services/contentServices/test-questions.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-test-question-creator',
  templateUrl: './test-question-creator.component.html',
  styleUrls: ['./test-question-creator.component.css']
})
export class TestQuestionCreatorComponent implements OnInit {

  // Ids of parent objects.
  public subjectid = null;
  public topicid = null;
  public testid = null;

  public submitted: boolean = false;         // Whether page has been submitted.
  public errorMessage: string = null;        // Error message to display if something goes wrong.

  // Values of question / answer / imageUrl. Used by preview.
  public questionValue: string = '';
  public answerValue: string = '';
  public imageUrlValue: string = '';
  public imageUrlValid: boolean = true;





  constructor(
    private subjectService: SubjectsService,
    private testQuestionService: TestQuestionsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    public navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Redirect to topic home if not admin.
      if (!isAdmin) {
        this.redirectToTestHome();
      }
    }, (err) => {
      console.error('TestQuestion-Creator isAdmin Error:', err);
    });


    // Watch values of question / answer / imageUrl inputs.
    document.getElementById('questionText').addEventListener('input', (e) => {
      this.questionValue = (<HTMLInputElement>e.target).value.trim();
    });
    document.getElementById('questionAnswer').addEventListener('input', (e) => {
      this.answerValue = (<HTMLInputElement>e.target).value.trim();
    });
    document.getElementById('questionImageUrl').addEventListener('input', (e) => {
      this.imageUrlValue = (<HTMLInputElement>e.target).value;
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
   * Validates input and attempts to create testquestion on api if valid.
   */
  public createTestQuestion(): void {
    // Build question. Ensure valid.
    let question = this.buildTestQuestion();
    if (question == null) { return; }

    // Submit if allowed.
    if (!this.submitted) {
      this.submitted = true;
      this.testQuestionService.createTestQuestion(this.subjectid, this.topicid, this.testid, question).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }


  /**
   * Builds testquestion object.
   * Returns object if successful.
   * Else returns null.
   */
  private buildTestQuestion(): object {
    let question = {
      question: null,
      answer: null,
      imageUrl: ''
    }

    // Question text.
    let text = <HTMLInputElement>document.getElementById('questionText');
    if (text == null) { return null; }
    if (text.value.trim() == '') {
      this.errorMessage = 'You must enter text for the question.'
      return null;
    }
    question.question = text.value.trim();

    // Answer.
    let answer = <HTMLInputElement>document.getElementById('questionAnswer');
    if (answer == null) { return null; }
    if (answer.value.trim() == '') {
      this.errorMessage = 'You must enter an answer for the question.'
      return null;
    }
    question.answer = answer.value.trim();

    // ImageURL.
    let imageUrl = <HTMLInputElement>document.getElementById('questionImageUrl');
    if (imageUrl == null) { return null; }
    question.imageUrl = imageUrl.value.trim();


    this.errorMessage = null;
    return question;
  }



  // Handlers for main api call (create test question)
  private handleSuccess = (res) => {
    let route = environment.routes.testQuestionHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.testid}`, this.testid);
    route = route.replace(`:${environment.routeParams.questionId}`, res[0].id);
    this.router.navigate([route]);
  }

  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // User inputted something wrong.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 401: // User not admin.
        this.redirectToTestHome();
        break;
      case 500: // Server went wrong.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;

      default:  // Unknown error.
        console.error('TestQuestion-Creator unknown error:', err);
        break;
    }
  }



  /**
   * Redirects user to test question list.
   */
  private redirectToTestHome() {
    this.router.navigate([
      this.navService.getTestHomeRoute(this.subjectid, this.topicid, this.testid)
    ]);
  }
}
