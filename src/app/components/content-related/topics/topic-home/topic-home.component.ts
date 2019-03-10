import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';
import { Lesson } from 'src/app/classes/Lesson';
import { Test } from 'src/app/classes/Test';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TopicsService } from 'src/app/services/contentServices/topics.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-topic-home',
  templateUrl: './topic-home.component.html',
  styleUrls: ['./topic-home.component.css']
})
export class TopicHomeComponent implements OnInit {

  public subjectid = null;
  
  public topic$: Topic = null;
  public loadingError: boolean = false;

  public isAdmin: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subjectService: SubjectsService,
    private topicService: TopicsService,
    private signIn: SignInService,
    private navService: NavigationServiceService
  ) { }


  ngOnInit() {
    // Get ids from url.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);

    // Set subject id in subject service.
    this.subjectService.setSubject(this.subjectid);
    
    // Get topic from api.
    this.topicService.getTopic(this.subjectid, topicid).subscribe((topics) => {
      this.topic$ = topics[0];
    }, (err) => {
      console.error('Topic-Home Error:', err);
      this.router.navigate([ this.navService.getSubjectListRoute() ]);
    });


    // Get whether user is an admin.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Topic-Home isAdmin Error:', err);
    })
  }

}
