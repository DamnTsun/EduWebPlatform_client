import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lesson } from 'src/app/classes/Lesson';
import { environment } from 'src/environments/environment';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-lesson-home',
  templateUrl: './lesson-home.component.html',
  styleUrls: ['./lesson-home.component.css']
})
export class LessonHomeComponent implements OnInit {

  public subjectid = null;
  public topicid = null;
  public isAdmin: boolean = false;

  public lesson$: Lesson = null;
  public loadingError: boolean = false;
  public lessonBody: SafeHtml;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signIn: SignInService,
    private subjectService: SubjectsService,
    private lessonService: LessonsService,
    private navService: NavigationServiceService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Get ids from url.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let lessonid = this.route.snapshot.paramMap.get(environment.routeParams.lessonid);

    // Set subject id in site service based on url parameter.
    this.subjectService.setSubject(this.subjectid);

    // Get lesson from api.
    this.lessonService.getLesson(this.subjectid, this.topicid, lessonid).subscribe((lessons) => {
      this.lesson$ = lessons[0];
      // Update lesson body for display. Bypasses all HTML checks. Allows script tags. (bad).
      // Was only way to get img srcs to work.
      this.lessonBody = this.sanitizer.bypassSecurityTrustHtml(this.lesson$.body.replace('\\\"', ''));
    }, (err) => {
      this.loadingError = true;
      console.error('LessonHome lesson$ Error:', err);
      this.router.navigate([ this.navService.getSubjectListRoute() ]);
    });


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('LessonHome isAdmin Error:', err);
    });
  }
}
