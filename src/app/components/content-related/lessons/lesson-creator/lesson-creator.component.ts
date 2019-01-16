import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lesson-creator',
  templateUrl: './lesson-creator.component.html',
  styleUrls: ['./lesson-creator.component.css']
})
export class LessonCreatorComponent implements OnInit {

  // Ids of 'parent'. Subject -> Topic -> Lesson.
  private subjectid = null;
  private topicid = null;
  private submitted: boolean = false;           // Whether page has been submitted.
  private errorMessage: string = null;          // Error message to display if something goes wrong.


  constructor(
    private subjectService: SubjectsService,
    private lessonService: LessonsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router
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
        //this.redirectToTopicHome();
      }
    }, (err) => {
      console.error('Lesson-Creator isAdmin Error:', err);
    });
  }



  /**
   * Validates inputs and creates lesson on API if valid.
   */
  private createLesson(): void {
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
      body: null
    }

    // Name
    let nameInput = <HTMLInputElement>document.getElementById('lessonName');
    if (nameInput == null) { return null; }
    if (nameInput.value == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    lesson.name = nameInput.value;

    // Body
    // Editor doesn't like 'tinymce' though it works fine in the compiled JS. Putting in try-catch anyway.
    try {
      let body = tinymce.activeEditor.getContent();
      if (body == '') {
        this.errorMessage = 'You must enter a description.';
        return null;
      }
      lesson.body = body;
    } catch {
      return null;
    }

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
}
