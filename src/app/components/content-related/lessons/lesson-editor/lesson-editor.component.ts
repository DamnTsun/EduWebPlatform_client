import { Component, OnInit } from '@angular/core';
import { Lesson } from 'src/app/classes/Lesson';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.css']
})
export class LessonEditorComponent implements OnInit {

  // Stores ids of parent objects, and the lesson itself (for id and original values)
  public subjectid = null;
  public topicid = null;
  public lessonid = null;
  public lesson$: Lesson = null;

  public submitted: boolean = false;           // Whether page has been submitted.
  public errorMessage: string = null;          // Error message if something goes wrong.

  // Current values of inputs.
  public nameValue: string = '';
  public bodyValue: string = '';
  public hiddenValue: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private lessonService: LessonsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    public navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.lessonid = this.route.snapshot.paramMap.get(environment.routeParams.lessonid);
    // Set current subject.
    this.subjectService.setSubject(this.subjectid);

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send to topic home if not admin.
      if (!isAdmin) {
        this.redirectToTopicHome();
      }
    }, (err) => {
      console.error('Lesson-Editor isAdmin Error:', err);
    });


    // Get lesson being editted.
    this.lessonService.getLesson(this.subjectid, this.topicid, this.lessonid).subscribe((lessons) => {
      this.lesson$ = lessons[0];
      this.setPageValues(this.lesson$);
    }, (err) => {
      console.error('Lesson-Editor getLesson Error:', err);
    });


    // Watch input values.
    document.getElementById('lessonName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value.trim();
    });
    document.getElementById('lessonBody').addEventListener('input', (e) => {
      this.bodyValue = (<HTMLTextAreaElement>e.target).value.trim();
    });
    document.getElementById('lessonHidden').addEventListener('input', (e) => {
      this.hiddenValue = (<HTMLInputElement>e.target).checked;
    });
  }



  /**
   * Populates page inputs with values from given lesson.
   * @param lesson - lesson with values.
   */
  private setPageValues(lesson): void {
    // Name
    let name = (<HTMLInputElement>document.getElementById('lessonName'));
    if (name !== null) { name.value = lesson.name; }
    this.nameValue = lesson.name;

    // Body
    let body = (<HTMLTextAreaElement>document.getElementById('lessonBody'));
    if (body !== null) { body.value = lesson.body; }
    this.bodyValue = lesson.body;

    // Hidden
    let hidden = (<HTMLInputElement>document.getElementById('lessonHidden'));
    if (hidden !== null) { hidden.checked = lesson.hidden; }
    this.hiddenValue = lesson.hidden;
  }

  public resetValues(): void {
    if (this.lesson$ !== null) {
      this.setPageValues(this.lesson$);
    }
  }



  /**
   * Validates and sends edit lesson request to api if valid.
   */
  public editLesson(): void {
    // Get and validate lesson.
    let lesson = this.buildLesson();
    if (lesson == null) { return; }
    if (Object.keys(lesson).length == 0) {
      this.errorMessage = 'You have not changed any values.'
      return;
    }

    // Submit if not already done.
    if (!this.submitted) {
      this.submitted = true;
      // Submit.
      this.lessonService.editLesson(this.subjectid, this.topicid, this.lesson$.id, lesson).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  private buildLesson(): object {
    let lesson = {};

    // Name
    let name = (<HTMLInputElement>document.getElementById('lessonName')).value;
    if (name.trim() == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    // Store name if it has changed.
    if (name !== this.lesson$.name) {
      lesson['name'] = name.trim();
    }


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
    if (this.bodyValue !== this.lesson$.body) {
      lesson['body'] = this.bodyValue;
    }

    // Hidden
    if (this.hiddenValue !== this.lesson$.hidden) {
      lesson['hidden'] = this.hiddenValue;
    }


    return lesson;
  }





  // Handlers for main api call (edit lesson)
  private handleSuccess = (res) => {
    // Redirect to updated lessons home.
    let route = environment.routes.lessonHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.lessonid}`, res[0].id);
    this.router.navigate([route]);
  }

  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // User inputted something wrong.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 401: // User not an admin.
        this.redirectToTopicHome();
        break;
      case 500: // Something went wrong with server.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;

      default:  // Unexpected error.
        console.error('Lesson-Editor unexpected error:', err);
        break;
    }
  }




  /**
   * Redirects user to topic home.
   */
  private redirectToTopicHome() {
    let route = environment.routes.topicHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.lessonid}`, this.lessonid.toString());
    this.router.navigate([route]);
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
