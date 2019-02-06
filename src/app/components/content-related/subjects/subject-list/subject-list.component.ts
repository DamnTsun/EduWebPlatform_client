import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/classes/Subject';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  // Constants
  private count = 10;
  private offset = 0;

  private subjects$: Subject[] = [];
  private endOfContent: boolean = false;

  private isAdmin: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private signIn: SignInService
  ) { }


  ngOnInit() {
    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.log('Subject-List isAdmin Error:', err);
    });


    // Get initial subjects to show.
    this.getSubjects();
  }


  /**
   * Scroll event for infinite scroll.
   */
  private onScroll() {
    if (!this.endOfContent) {
      this.getSubjects();
    }
  }

  /**
   * Attempts to get subjects from api.
   */
  private getSubjects() {
    this.subjectService.getSubjects(this.count, this.offset).subscribe((subjects: Subject[]) => {
      if (subjects.length > 0) {
        this.subjects$ = this.subjects$.concat(subjects);
        this.offset += subjects.length;
      } else {
        // Empty list fetched. Must be end of subjects.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Subject-List error getting subjects:', err);
    })
  }

  
  /**
   * Deletes subject with given index.
   * @param index - index of subject in subjects$.
   */
  private deleteSubject(index): void {
    // Check user is an admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.subjects$.length) { return; }
    // Get confirmation from user.
    if (!confirm(`Are you sure you want to delete subject '${this.subjects$[index].name}'?`)) { return; }

    // Delete the subject.
    this.subjectService.deleteSubject(this.subjects$[index].id).subscribe((a) => {
      // Successful. Remove subject from list.
      this.subjects$ = this.subjects$.filter((s, i, a) => {
        return i !== index;
      });
    }, (err) => {
      console.error('Subject-List delete subject Error:', err);
    });
  }
}
