import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';
import { Lesson } from 'src/app/classes/Lesson';
import { Test } from 'src/app/classes/Test';

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





  constructor(
    private route: ActivatedRoute,
    private site: SiteService
  ) { }


  ngOnInit() {
    // Get ids from url.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);

    // Set subject id in site service based on url parameter.
    this.site.setSubject(subjectid);
    
    // Get topic from api.
    this.site.getTopic(subjectid, topicid).subscribe((topics) => {
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
  }

}
