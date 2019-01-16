import { Component, OnInit, ViewChild } from '@angular/core';
import { Lesson } from 'src/app/classes/Lesson';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { QuillEditorComponent } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-lesson-editor',
  templateUrl: './lesson-editor.component.html',
  styleUrls: ['./lesson-editor.component.css']
})
export class LessonEditorComponent implements OnInit {

  // Stores ids of parent objects, and the lesson itself (for id and original values)
  private subjectid = null;
  private topicid = null;
  private lesson$: Lesson = null;

  private submitted: boolean = false;           // Whether page has been submitted.
  private errorMessage: string = null;          // Error message if something goes wrong.

  @ViewChild('body') editor: QuillEditorComponent;
  private body: string = null;


  constructor(
    private subjectService: SubjectsService,
    private lessonService: LessonsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let lessonid = this.route.snapshot.paramMap.get(environment.routeParams.lessonid);
    // Set current subject.
    this.subjectService.setSubject(this.subjectid);

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send to topic home if not admin.
      if (!isAdmin) {
        //this.redirectToTopicHome();
      }
    }, (err) => {
      console.error('Lesson-Editor isAdmin Error:', err);
    });


    // Store html when it is changed.
    this.editor.onContentChanged.subscribe(e => {
      this.body = e.html;
    });


    // Get lesson being editted.
    this.lessonService.getLesson(this.subjectid, this.topicid, lessonid).subscribe((lessons) => {
      this.lesson$ = lessons[0];
      this.setPageValues(this.lesson$);
    }, (err) => {
      console.error('Lesson-Editor getLesson Error:', err);
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

    // Body
    // Remove the '\"' around image sources.
    let insert = this.sanitizer.bypassSecurityTrustHtml(this.deescapeHTML(lesson.body)).toString();
    // Angular adds a message at start and end about unsafe html.
    // And conviently don't provide any easy method to get rid of that crap...
    insert = insert.substring(39, insert.length - 34);
    this.editor.writeValue(insert.toString());
  }

  private resetValues(): void {
    if (this.lesson$ !== null) {
      this.setPageValues(this.lesson$);
    }
  }



  /**
   * Validates and sends edit lesson request to api if valid.
   */
  private editLesson(): void {
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
    if (name == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    // Store name if it has changed.
    if (name !== this.lesson$.name) {
      lesson['name'] = name;
    }


    // Body
    if (this.body == null ||
        this.body == '') {
      this.errorMessage = 'You must enter a body.';
      return null;
    }
    if (this.body.length > 65535) {
      this.errorMessage = 'Encoded body cannot contain more than 65,535 characters.';
      return null;
    }
    // Store body if it has changed.
    if (this.body !== this.deescapeHTML(this.lesson$.body)) {
      lesson['body'] = this.body;
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
    this.router.navigate([ route ]);
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
    route = route.replace(`:${environment.routeParams.lessonid}`, this.lesson$.id.toString());
    this.router.navigate([ route ]);
  }



  /**
   * 'De-escapes' HTML. Does things such as changing '\"' to '"', etc.
   * @param html - HTML to be 'de-escaped'.
   */
  private deescapeHTML(html: string) {
    html = html.replace(/\\"/g, '"');
    return html;
  }

  /**
   * Gets length of body in memory for display.
   */
  private getBodyLength() {
    if (this.body == null) { return 0; }
    return this.body.length;
  }
}
