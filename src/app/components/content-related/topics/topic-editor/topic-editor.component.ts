import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TopicsService } from 'src/app/services/contentServices/topics.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-topic-editor',
  templateUrl: './topic-editor.component.html',
  styleUrls: ['./topic-editor.component.css']
})
export class TopicEditorComponent implements OnInit {

  public subjectid = null;
  public topic$: Topic = null;               // Topic being editted. Used when setting / resetting to init vals.
  public submitted: boolean = false;         // Whether form has been submitted successfully or in process of.
  public errorMessage: string = null;        // Error message displayed if something goes wrong.

  // Values of name / description. Used by preview.
  public nameValue: string = '';
  public descriptionValue: string = '';
  public hiddenValue: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private topicService: TopicsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router,
    public navService: NavigationServiceService,
    public util: UtilService
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    // Set current subject.
    this.subjectService.setSubject(this.subjectid);

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send to topic select if not admin.
      if (!isAdmin) {
        this.redirectToTopicSelect();
      }
    }, (err) => {
      console.error('Topic-Editor isAdmin Error:', err);
    });


    // Get topic being editted.
    this.topicService.getTopic(this.subjectid, topicid).subscribe((topics) => {
      // If topic returned, set initial values for inputs. Also store to allow for resets.
      if (topics !== null && topics.length > 0) {
        this.topic$ = topics[0];
        this.setPageValues(this.topic$);
      }
    }, (err) => {
      console.error('Topic-Editor topic Error:', err);
    });


    // Get values of name / description.
    document.getElementById('topicName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('topicDescription').addEventListener('input', (e) => {
      this.descriptionValue = (<HTMLTextAreaElement>e.target).value;
    });
    document.getElementById('topicHidden').addEventListener('input', (e) => {
      this.hiddenValue = (<HTMLInputElement>e.target).checked;
    });
  }



  /**
   * Sets values on page based on given topic object.
   * @param topic - topic object. Name / description fields set based on this.
   */
  private setPageValues(topic): void {
    // Name
    let name = <HTMLInputElement>document.getElementById('topicName');
    if (name !== null) { name.value = topic.name; }
    this.nameValue = topic.name;

    // Description
    let description = <HTMLTextAreaElement>document.getElementById('topicDescription');
    if (description !== null) { description.value = topic.description; }
    this.descriptionValue = topic.description;

    // Hidden
    let hidden = <HTMLInputElement>document.getElementById('topicHidden');
    if (hidden !== null) { hidden.checked = topic.hidden; }
    this.hiddenValue = topic.hidden;
  }

  /**
   * Resets value on page back to original values of topic being editted.
   */
  public resetValues(): void {
    if (this.topic$ !== null) {
      this.setPageValues(this.topic$);
    }
  }



  /**
   * Validates inputs and sends request to api to edit subject if inputs valid.
   */
  public editTopic(): void {
    // Attempt to build topic object. Check it.
    let topic = this.buildTopic();
    if (topic == null) { return; }
    if (Object.keys(topic).length == 0) {
      this.errorMessage = 'You have not changed any values.';
      return;
    }

    // Submit if not already done.
    if (!this.submitted) {
      this.submitted = true;
      // Get subjectid.
      let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
      this.topicService.editTopic(subjectid, this.topic$.id, topic).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  /**
   * Builds topic object for the new values.
   * If valid, will return topic object if successful.
   *  May return object with 0 attributes if no values are changed. Please check received object.
   * Else will return null.
   */
  private buildTopic(): object {
    let topic = {};

    // Name.
    let name = (<HTMLInputElement>document.getElementById('topicName')).value;
    if (name.trim() == '') {
      this.errorMessage = 'You must enter a name.'
      return null;
    }
    // Add to object if name has changed.
    if (name !== this.topic$.name) {
      topic['name'] = name.trim();
    }


    // Description
    let description = (<HTMLTextAreaElement>document.getElementById('topicDescription')).value;
    if (description !== this.topic$.description) {
      topic['description'] = description;
    }


    // Hidden
    if (this.hiddenValue !== this.topic$.hidden) {
      topic['hidden'] = this.hiddenValue;
    }

    // Clear error message if validation passed.
    this.errorMessage = null;
    return topic;
  }





  // Event handlers for the main api call (edit topic).
  private handleSuccess = (res) => {
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    // Redirect to updated topics home.
    let route = environment.routes.topicHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topic$.id.toString());
    this.router.navigate([route]);
  }

  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // User input something wrong.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 401: // User not admin.
        this.redirectToTopicSelect();
        break;
      case 500: // Something wrong with server.
        this.errorMessage = 'Something went wrong with the server. Please try again later.';
        break;

      default: // Unexpected error.
        console.error('Topic-Editor editTopic Error:', err);
        break;
    }
  }


  private redirectToTopicSelect(): void {
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let route = environment.routes.topicSelect;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    this.router.navigate([ route ]);
  }
}
