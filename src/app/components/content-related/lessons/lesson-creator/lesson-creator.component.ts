import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-lesson-creator',
  templateUrl: './lesson-creator.component.html',
  styleUrls: ['./lesson-creator.component.css']
})
export class LessonCreatorComponent implements OnInit {

  // Ids of 'parent'. Subject -> Topic -> Lesson.
  public subjectid = null;
  public topicid = null;
  public submitted: boolean = false;           // Whether page has been submitted.
  public errorMessage: string = null;          // Error message to display if something goes wrong.


  // Current value of name, body, hidden values.
  public nameValue: string = '';
  public bodyValue: string = '';
  public hiddenValue: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private lessonService: LessonsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    public navService: NavigationServiceService,
    public util: UtilService
  ) { }

  ngOnInit() {
    // Get values from params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send back to topic home if not admin.
      if (!isAdmin) {
        this.redirectToTopicHome();
      }
    }, (err) => {
      console.error('Lesson-Creator isAdmin Error:', err);
    });


    // Watch input values.
    document.getElementById('lessonName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value.trim();
    });
    document.getElementById('lessonBody').addEventListener('input', (e) => {
      this.bodyValue = (<HTMLInputElement>e.target).value.trim();
    });
    document.getElementById('lessonHidden').addEventListener('input', (e) => {
      this.hiddenValue = (<HTMLInputElement>e.target).checked;
    });
  }



  /**
   * Validates inputs and creates lesson on API if valid.
   */
  public createLesson(): void {
    // Get and check lesson.
    let lesson = this.buildLesson();
    if (lesson == null) { return; }

    // Submit if allowed.
    if (!this.submitted) {
      this.submitted = true;
      this.lessonService.createLesson(this.subjectid, this.topicid, lesson).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  /**
   * Builds lesson object for sending to API.
   * Returns constructed lesson object if successful.
   * Else will return null.
   */
  private buildLesson(): object {
    let lesson = {
      name: null,
      body: null,
      hidden: false
    }

    // Name
    let nameInput = <HTMLInputElement>document.getElementById('lessonName');
    if (nameInput == null) { return null; }
    if (nameInput.value.trim() == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    lesson.name = nameInput.value.trim();

    // Body
    if (this.bodyValue == null ||
        this.bodyValue == '') {
      this.errorMessage = 'You must enter a body.';
      return null;
    }
    if (this.bodyValue.length > 16384) {
      this.errorMessage = 'Encoded body cannot contain more than 16,384 characters.';
      return null;
    }
    lesson.body = this.bodyValue;

    // Hidden
    lesson.hidden = this.hiddenValue;

    // Clear error since inputs must be valid.
    this.errorMessage = null;
    return lesson;
  }





  // Handlers for create lesson api request.
  private handleSuccess = (res) => {
    // Redirect to newly created lesson.
    let route = environment.routes.lessonHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.lessonid}`, res[0].id);
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

      default: // Unexpected error.
        this.errorMessage = 'Something unexpected went wrong. Please contact an admin.';
        console.error('Lesson-Creator createLesson Error:', err);
        break;
    }
  }



  /**
   * Redirects user to topic home for current topic (based on current route parameter).
   */
  private redirectToTopicHome(): void {
    let route = environment.routes.topicHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    this.router.navigate([ route ]);
  }



  // HTML methods
  /**
   * Gets length of name input.
   */
  public getNameLength(): number {
    if (this.nameValue === null) { return 0; }
    return this.nameValue.length;
  }
}
