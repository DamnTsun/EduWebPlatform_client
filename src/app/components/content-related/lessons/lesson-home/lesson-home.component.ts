import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import { Lesson } from 'src/app/classes/Lesson';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lesson-home',
  templateUrl: './lesson-home.component.html',
  styleUrls: ['./lesson-home.component.css']
})
export class LessonHomeComponent implements OnInit {

  private lesson$: Lesson = null;
  private loadingError: boolean = false;



  constructor(
    private route: ActivatedRoute,
    private site: SiteService
  ) { }

  ngOnInit() {
    // Get ids from url.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let lessonid = this.route.snapshot.paramMap.get(environment.routeParams.lessonid);

    // Set subject id in site service based on url parameter.
    this.site.setSubject(subjectid);

    // Get lesson from api.
    this.site.getLesson(subjectid, topicid, lessonid).subscribe((lessons) => {
      this.lesson$ = lessons[0];
    }, (err) => {
      this.loadingError = true;
      console.error('LessonHome lesson$ Error:', err);
    });
  }

}
