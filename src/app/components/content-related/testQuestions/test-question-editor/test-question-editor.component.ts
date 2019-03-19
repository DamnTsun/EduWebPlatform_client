import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestQuestionsService } from 'src/app/services/contentServices/test-questions.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TestQuestion } from 'src/app/classes/TestQuestion';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-test-question-editor',
  templateUrl: './test-question-editor.component.html',
  styleUrls: ['./test-question-editor.component.css']
})
export class TestQuestionEditorComponent implements OnInit {

  // Ids of parent objects and question being editted.
  public subjectid = null;
  public topicid = null;
  public testid = null;
  public question$ = null;

  public submitted: boolean = false;           // Whether page has been submitted.
  public errorMessage: string = null;          // Error message if something goes wrong.

  // Value of question / answer / imageUrl inputs.
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
    let questionid = this.route.snapshot.paramMap.get(environment.routeParams.questionId);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Redirect to test home if not admin.
      if (!isAdmin) {
        this.redirectToTestHome();
      }
    }, (err) => {
      console.error('TestQuestion-Editor isAdmin Error:', err);
    });


    // Get question being editted.
    this.testQuestionService.getTestQuestion(this.subjectid, this.topicid, this.testid, questionid)
      .subscribe((questions: TestQuestion[]) => {
      if (questions !== null && questions.length > 0) {
        this.question$ = questions[0];
        this.setPageValues(this.question$);
      }
    }, (err) => {
      console.error('TestQuestion-Editor question$ Error:', err);
    });


    // Watch values for question / answer / imageUrl.
    document.getElementById('questionText').addEventListener('input', (e) => {
      this.questionValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('questionAnswer').addEventListener('input', (e) => {
      this.answerValue = (<HTMLInputElement>e.target).value;
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
   * Sets values of input fields based on given object.
   * @param question - object containing current values.
   */
  private setPageValues(question): void {
    // Text
    let text = <HTMLInputElement>document.getElementById('questionText');
    if (text !== null) { text.value = question.question; }
    this.questionValue = question.question;

    // Answer
    let answer = <HTMLInputElement>document.getElementById('questionAnswer');
    if (answer !== null) { answer.value = question.answer; }
    this.answerValue = question.answer;
    // Image url.
    let imageUrl = <HTMLInputElement>document.getElementById('questionImageUrl');
    if (imageUrl !== null) { imageUrl.value = question.imageUrl; }
    this.imageUrlValue = question.imageUrl;
  }

  /**
   * Resets inputs to their initial values.
   */
  public resetValues(): void {
    if (this.question$ !== null) {
      this.setPageValues(this.question$);
    }
  }



  /**
   * Validates inputs and updates question on api if valid.
   */
  public editTestQuestion(): void {
    // Get and validate question.
    let question = this.buildTestQuestion();
    if (question == null) { return; }
    if (Object.keys(question).length == 0) {
      this.errorMessage = 'You have not changed any values.';
      return;
    }
    
    // Submit if allowed.
    if (!this.submitted) {
      this.submitted = true;
      this.testQuestionService.editTestQuestion(
        this.subjectid, this.topicid, this.testid, this.question$.id, question).subscribe(
          this.handleSuccess,
          this.handleFailure
      );
    }
  }

  /**
   * Builds question object containing values for updating.
   * Returns object if successful.
   *  May return object with no attributes if no values changed.
   * Else returns null.
   */
  private buildTestQuestion(): object {
    let question = {};
    
    // Text
    let text = <HTMLInputElement>document.getElementById('questionText');
    if (text == null) { return null; }
    if (text.value.trim() == '') {
      this.errorMessage = 'You must enter text for the question.';
      return null;
    }
    if (text.value.trim() !== this.question$.question) {
      question['question'] = text.value.trim();
    }

    // Answer
    let answer = <HTMLInputElement>document.getElementById('questionAnswer');
    if (answer == null) { return null; }
    if (answer.value.trim() == '') {
      this.errorMessage = 'You must enter an answer for the question.';
      return null;
    }
    if (answer.value.trim() !== this.question$.answer) {
      question['answer'] = answer.value.trim();
    }

    // Image url
    let imageUrl = <HTMLInputElement>document.getElementById('questionImageUrl');
    if (imageUrl == null) { return null; }
    if (imageUrl.value.trim() !== this.question$.imageUrl) {
      question['imageUrl'] = imageUrl.value.trim();
    }

    this.errorMessage = null;
    return question;
  }



  // Handlers for main api call (edit test question)
  private handleSuccess = (res) => {
    let route = environment.routes.testQuestionHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.testid}`, this.testid);
    route = route.replace(`:${environment.routeParams.questionId}`, res[0].id);
    this.router.navigate([ route ]);
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
      case 500: // Something went wrong with server.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;

      default:  // Unknown error.
        console.error('TestQuestion-Editor unknown error:', err);
        break;
    }
  }


  /**
   * Redirects user to topic home.
   */
  private redirectToTestHome() {
    this.router.navigate([
      this.navService.getTestHomeRoute(this.subjectid, this.topicid, this.testid)
    ]);
  }
}
