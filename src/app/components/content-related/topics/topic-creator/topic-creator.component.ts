import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TopicsService } from 'src/app/services/contentServices/topics.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subject } from 'src/app/classes/Subject';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-topic-creator',
  templateUrl: './topic-creator.component.html',
  styleUrls: ['./topic-creator.component.css']
})
export class TopicCreatorComponent implements OnInit {

  public subjectid = null;
  public subject$: Subject = null;
  public submitted: boolean = false;     // Whether page has been submitted.
  public errorMessage: string = null;    // Error message to display if something goes wrong.

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
    public navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Set subject.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(this.subjectid);

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send back to topic select if not admin.
      if (!isAdmin) {
        // Redirect to topic list.
        this.redirectToTopicList();
      }
    }, (err) => {
      console.error('Topic-Creator isAdmin Error:', err);
    });

    // Get subject we are currently in.
    this.subjectService.subject().subscribe((subject) => {
      this.subject$ = subject;
    }, (err) => {
      console.error('Topic-Creator subject$ Error:', err);
    });


    // Watch values of name / description.
    document.getElementById('topicName').addEventListener('input', (e) => {
      this.nameValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('topicDescription').addEventListener('input', (e) => {
      this.descriptionValue = (<HTMLTextAreaElement>e.target).value;
    });
    document.getElementById('topicHidden').addEventListener('input', (e) => {
      this.hiddenValue = (<HTMLInputElement>e.target).checked;
    })
  }



  /**
   * Validates inputs and creates topic on API if valid.
   */
  private createTopic(): void {
    // Get topic, ensure valid.
    let topic = this.buildTopic();
    if (topic == null) { return; }

    // If page hasn't been submitted.
    if (!this.submitted) {
      this.submitted = true;
      this.topicService.createTopic(this.subject$.id, topic).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  /**
   * Builds topic object for sending to API.
   * Returns constructed topic object if successful.
   * Else will return null.
   */
  private buildTopic(): object {
    let topic = {
      name: null,
      description: null,
      hidden: false
    }

    // Get name input.
    let nameInput = <HTMLInputElement>document.getElementById('topicName');
    if (nameInput == null ||
        nameInput.value.trim() == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    topic.name = nameInput.value.trim();

    // Get description input.
    let descriptionInput = <HTMLInputElement>document.getElementById('topicDescription');
    if (descriptionInput == null) { return null; }
    topic.description = descriptionInput.value.trim();

    // Hidden
    topic.hidden = this.hiddenValue;

    return topic;
  }


  // Handlers for create topic api request.
  private handleSuccess = (res) => {
    // Redirect to newly created topics area.
    let route = environment.routes.topicHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subject$.id.toString());
    route = route.replace(`:${environment.routeParams.topicid}`, res[0].id);
    this.router.navigate([ route ]);
  }

  private handleFailure = (err) => {
    switch (err.status) {
      case 400: // User did something wrong.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 401: // User not admin.
        this.redirectToTopicList();
        break;
      case 500: // Something wrong with server.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;
      

      default: // Something unexpected.
        console.error('Topic-Creator createTopic Error:', err);
        break;
    }
  }



  private redirectToTopicList() {
    let route = environment.routes.topicSelect;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid.toString());
    this.router.navigate([ route ]);
  }
}
