import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TopicsService } from 'src/app/services/contentServices/topics.service';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {

  private topics$: Topic[];
  private loadingError: boolean = false;
  private isAdmin: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private topicService: TopicsService,
    private signIn: SignInService
  ) { }

  ngOnInit() {
    // Set subjectid to set subject. Then get associated topics.
    let subjectId = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(subjectId);

    // Subscribe to topics.
    this.topicService.getTopics(subjectId).subscribe((topics) => {
      this.topics$ = topics;
    }, (err) => {
      this.loadingError = true;
      console.error(err);
    });

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Topic-List isAdmin Error:', err);
    });
  }
  


  /**
   * Deletes topic with given index in array.
   * @param index - index of topic in topics$.
   */
  private deleteTopic(index) {
    // Check user is admin.
    if (this.isAdmin) {
      // Check index is valid.
      if (index >= 0 && index < this.topics$.length) {
        // Get subjectid.
        let subjectId = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);

        // Delete the topic.
        this.topicService.deleteTopic(subjectId, this.topics$[index].id).subscribe((res) => {
          // Successful. Remove topic from list.
          this.topics$ = this.topics$.filter((t, i, a) => {
            return i !== index;
          });
        }, (err) => {
          console.error('Topic-List delete topic Error:', err);
        });
      }
    }
  }
}
