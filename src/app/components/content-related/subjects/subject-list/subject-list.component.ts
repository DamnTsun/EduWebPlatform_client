import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { Subject } from 'src/app/classes/Subject';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  private subjects$: Subject[] = null;
  private isAdmin: boolean = false;





  constructor(
    private site: SiteService,
    private signIn: SignInService
  ) { }


  ngOnInit() {
    // Get list of subjects.
    this.site.getSubjects()
      .subscribe((subjects) => {
        this.subjects$ = subjects
    });

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.log('Subject-List isAdmin Error:', err);
    });
  }


  
  /**
   * Deletes subject with given index.
   * @param index - index of subject in subjects$.
   */
  private deleteSubject(index): void {
    // Check user is an admin.
    if (this.isAdmin) {
      // Check index is valid.
      if (index >= 0 && index < this.subjects$.length) { 
        // Delete the subject.
        this.site.deleteSubject(this.subjects$[index].id).subscribe((a) => {
          // Successful. Remove subject from list.
          this.subjects$ = this.subjects$.filter((s, i, a) => {
            return i !== index;
          });
        }, (err) => {
          console.error('Subject-List delete subject Error:', err);
        })
      }
    }
  }
}
