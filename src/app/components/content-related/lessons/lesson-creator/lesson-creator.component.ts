import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;

import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { UtilService } from 'src/app/services/util.service';
import { QuillEditorComponent } from 'ngx-quill';

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

  @ViewChild('bodyEditor') bodyEditor: QuillEditorComponent;

  // Current value of name, body, hidden values.
  public nameValue: string = '';
  public bodyValue: string = '';
  public hiddenValue: boolean = false;

  // Toolbar options for editor.
  public quillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],          // Toggle buttons for bold, italic, underline, strikethough.
        ['code-block'],                                     // Toggle buttons for and code.

        [{ 'header': 1 }, { 'header': 2 }],                 // Buttons for heading 1 / 2.
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],       // Buttons for ordered and bullet lists.
        [{ 'script': 'sub'}, { 'script': 'super' }],        // Toggle buttons for sub and super script.
        [{ 'direction': 'rtl' }],                           // Toggle button for change text direction.

        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],          // Setting headers.

        [{ 'color': [] }, { 'background': [] }],            // Set color of text / background.
        [{ 'font': [] }],                                   // Set font.
        [{ 'align': [] }]                                   // Set text alignment.
      ]
    }
  }





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
    document.getElementById('lessonHidden').addEventListener('input', (e) => {
      this.hiddenValue = (<HTMLInputElement>e.target).checked;
    });
    this.bodyEditor.onContentChanged.subscribe((e) => {
      this.bodyValue = e.html;
      if (this.bodyValue === null) { this.bodyValue = ''; }
    });
    
    // Set up quill to use styles instead of classes.
    Quill.register(Quill.import('attributors/style/align'), true);
    Quill.register(Quill.import('attributors/style/background'), true);
    Quill.register(Quill.import('attributors/style/color'), true);
    Quill.register(Quill.import('attributors/style/direction'), true);
    Quill.register(Quill.import('attributors/style/font'), true);
    Quill.register(Quill.import('attributors/style/size'), true);
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
