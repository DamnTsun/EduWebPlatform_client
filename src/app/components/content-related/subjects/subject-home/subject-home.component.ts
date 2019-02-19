import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Subject } from 'src/app/classes/Subject';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { Post } from 'src/app/classes/Posts';

@Component({
  selector: 'app-subject-home',
  templateUrl: './subject-home.component.html',
  styleUrls: ['./subject-home.component.css']
})
export class SubjectHomeComponent implements OnInit {

  private subjectid = null;
  private subject$: Subject = null;
  private loadingError: boolean = false;

  // Number of news posts to get.
  public newsCount: number = 3;
  private news: Post[] = [];





  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private navService: NavigationServiceService
  ) { }


  ngOnInit() {
    // Get route params, set subject.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(this.subjectid);
    

    // Subscribe to subject record to get its data.
    this.subjectService.subject().subscribe((subject) => {
      this.subject$ = subject;
    }, (err) => {
      this.loadingError = true;
      console.error(err);
    });


    // Get newCount number of news posts to display.
    this.subjectService.getPosts(this.subjectid, this.newsCount, 0).subscribe((posts: Post[]) => {
      this.news = posts;
    }, (err) => {
      console.error('SubjectHome get recent news Error:', err);
    })
  }

}
