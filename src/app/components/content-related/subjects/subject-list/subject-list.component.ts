import { Component, OnInit } from '@angular/core';
import { Subject } from 'src/app/classes/Subject';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  // Constants
  private count = 18;
  private offset = 0;

  public subjects$: Subject[] = [];
  public endOfContent: boolean = false;

  public isAdmin: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private signIn: SignInService,
    public util: UtilService
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
  public onScroll() {
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
        // Check if desired number of subjects fetched. If not, must be end of subject.
        if (subjects.length < this.count) { this.endOfContent = true; }
      } else {
        // Empty list fetched. Must be end of subjects.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Subject-List error getting subjects:', err);
    })
  }

  
  // Store index of subject to be deleted. Used by delete modal.
  public deleteSubjectIndex = null;
  /**
   * Deletes subject with given index.
   * @param index - index of subject in subjects$.
   */
  public deleteSubject(index): void {
    // Check user is an admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.subjects$.length) { return; }

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
