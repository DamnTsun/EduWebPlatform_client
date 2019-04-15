import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { LessonsService } from 'src/app/services/contentServices/lessons.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Lesson } from 'src/app/classes/Lesson';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-lesson-list',
  templateUrl: './lesson-list.component.html',
  styleUrls: ['./lesson-list.component.css']
})
export class LessonListComponent implements OnInit {

  // Constants
  private count = 18;                       // Number of lesson to get at a time.
  private offset = 0;                       // How many lessons have already been fetched.

  public subjectid = null;
  public topicid = null;
  public endOfContent: boolean = false;
  public isAdmin: boolean = false;
  public lessons$: Lesson[] = [];


  constructor(
    private subjectService: SubjectsService,
    private lessonService: LessonsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    public navService: NavigationServiceService,
    public util: UtilService
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Lesson-List isAdmin error:', err);
    });


    // Get initial lessons.
    this.getLessons();
  }


  /**
   * Scroll event for infinite scroll.
   */
  public onScroll() {
    if (!this.endOfContent) {
      this.getLessons();
    }
  }

  /**
   * Attempt to get more lessons from api.
   */
  private getLessons() {
    this.lessonService.getLessons(this.subjectid, this.topicid, this.count, this.offset)
      .subscribe((lessons: Lesson[]) => {
        if (lessons.length > 0) {
          this.lessons$ = this.lessons$.concat(lessons);
          this.offset += lessons.length;
          // If less lesson received than asked for, must be end of content.
          if (lessons.length < this.count) {
            this.endOfContent = true;
          }
        } else {
          // Empty list. Must be end of lessons.
          this.endOfContent = true;
        }
    })
  }



  // Store index for lesson to be deleted. Used by delete modal.
  public deleteLessonIndex = null;
  /**
   * Deletes lesson with given index in array.
   * @param index - index of lesson.
   */
  public deleteLesson(index) {
    // Check user is an admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.lessons$.length) { return; }

    // Attempt to delete.
    this.lessonService.deleteLesson(this.subjectid, this.topicid, this.lessons$[index].id).subscribe((res) => {
      // Successful, remove from list.
      this.lessons$ = this.lessons$.filter((l, i, a) => {
        return i !== index;
      });
      this.offset--;
    }, (err) => {
      console.error('Lesson-List delete lesson error:', err);
    })
  }
}
