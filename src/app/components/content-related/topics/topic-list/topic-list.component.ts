import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TopicsService } from 'src/app/services/contentServices/topics.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { $ } from 'protractor';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {

  // Constants
  private count = 10;
  private offset = 0;

  private subjectid = null;
  private topics$: Topic[] = [];
  private endOfContent: boolean = false;
  private loadingError: boolean = false;
  private isAdmin: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private topicService: TopicsService,
    private signIn: SignInService,
    private navService: NavigationServiceService
  ) { }

  ngOnInit() {
    // Set subjectid to set subject. Then get associated topics.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Topic-List isAdmin Error:', err);
    });


    // Get initial topics.
    this.getTopics();
  }


  /**
   * Scroll event for infinite scroll.
   */
  private onScroll() {
    if (!this.endOfContent) {
      this.getTopics();
    }
  }

  /**
   * Attempts to get topics from api.
   */
  private getTopics() {
    this.topicService.getTopics(this.subjectid, this.count, this.offset).subscribe((topics: Topic[]) => {
      if (topics.length > 0) {
        this.topics$ = this.topics$.concat(topics);
        this.offset += topics.length;
      } else {
        // Empty list fetched. Must be end of topics.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Topic-List error getting topics:', err);
    });
  }


  /**
   * Deletes topic with given index in array.
   * @param index - index of topic in topics$.
   */
  private deleteTopic(index) {
    // Check user is admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.topics$.length) { return; }
    // Get confirmation from user.
    if (!confirm(`Are you sure you want to delete topic '${this.topics$[index].name}'?`)) { return; }

    // Attempt to delete.
    this.topicService.deleteTopic(this.subjectid, this.topics$[index].id).subscribe((res) => {
      // Successful. Remove topic from list.
      this.topics$ = this.topics$.filter((t, i, a) => {
        return i !== index;
      });
    }, (err) => {
      console.error('Topic-List delete topic Error:', err);
    });
  }


}
