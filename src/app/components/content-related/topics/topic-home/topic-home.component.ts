import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';
import { Lesson } from 'src/app/classes/Lesson';
import { Test } from 'src/app/classes/Test';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TopicsService } from 'src/app/services/contentServices/topics.service';

@Component({
  selector: 'app-topic-home',
  templateUrl: './topic-home.component.html',
  styleUrls: ['./topic-home.component.css']
})
export class TopicHomeComponent implements OnInit {

  private topic$: Topic = null;
  private loadingError: boolean = false;
  // List of lessons / tests in topic.
  private lessons$: Lesson[] = null;
  private tests$: Test[] = null;

  private isAdmin: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private topicService: TopicsService,
    private site: SiteService,
    private signIn: SignInService
  ) { }


  ngOnInit() {
    // Get ids from url.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);

    // Set subject id in subject service.
    this.subjectService.setSubject(subjectid);
    
    // Get topic from api.
    this.topicService.getTopic(subjectid, topicid).subscribe((topics) => {
      this.topic$ = topics[0];
    }, (err) => {
      console.error('Topic-Home Error:', err);
    });

    // Lessons / tests.
    // Get lessons in topic from api.
    this.site.getLessons(subjectid, topicid).subscribe((lessons) => {
      this.lessons$ = lessons;
    })
    // Get tests in topic from api.
    this.site.getTests(subjectid, topicid).subscribe((tests) => {
      this.tests$ = tests;
    })

    // Get whether user is an admin.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Topic-Home isAdmin Error:', err);
    })
  }





  // Admin button functions.
  /**
   * Deletes lesson with index in array.
   * @param index - index of lesson in lessons$.
   */
  private deleteLesson(index) {
    // Check user is an admin.
    if (this.isAdmin) {
      // Check index is valid.
      if (index >= 0 && index < this.lessons$.length) {
        // Get subjectid and topicid.
        let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
        let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);

        // Delete the lesson.
        this.site.deleteLesson(subjectid, topicid, this.lessons$[index].id).subscribe((res) => {
          // Successful. Remove from list.
          this.lessons$ = this.lessons$.filter((l, i, a) => {
            return i !== index;
          })
        }, (err) => {
          console.error('Topic-Home delete lesson Error:', err);
        })
      }
    }
  }

  /**
   * Deletes test with index in array.
   * @param index - index of test in tests$.
   */
  private deleteTest(index) {
    // Check user is an admin.
    if (this.isAdmin) {
      // Check index is valid.
      if (index >= 0 && index < this.tests$.length) {
        // Get subjectid and topicid.
        let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
        let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);

        // Delete the test.
        this.site.deleteTest(subjectid, topicid, this.tests$[index].id).subscribe((res) => {
          // Successful. Remove from list.
          this.tests$ = this.tests$.filter((t, i, a) => {
            return i !== index;
          })
        }, (err) => {
          console.error('Topic-Home delete test Error:', err);
        })
      }
    }
  }
}
