import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SignInService } from 'src/app/services/sign-in.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'src/app/classes/Subject';

@Component({
  selector: 'app-subject-editor',
  templateUrl: './subject-editor.component.html',
  styleUrls: ['./subject-editor.component.css']
})
export class SubjectEditorComponent implements OnInit {

  private subject$: Subject = null;
  private submitted: boolean = false;
  private errorMessage: string = null;





  constructor(
    private subjectService: SubjectsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Set the current subject.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(subjectid);

    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      // Send to subject select.
      if (!isAdmin) {
        this.router.navigate([ environment.routes.subjectSelect ]);
      }
    }, (err) => {
      console.error('Subject-Editor isAdmin Error:', err);
    });

    // Get the subject being edited.
    this.subjectService.subject().subscribe((subject) => {
      // If a subject was returned.
      if (subject !== null) {
        // Set values on form for current subject. Store subject for reset button.
        this.subject$ = subject;
        this.setPageValues(subject);
      }
    }, (err) => {
      console.error('Subject-Editor subject Error:', err);
    });
  }

  /**
   * Sets current values on page. Used to populate inputs with existing subject values.
   * @param subject - subject being editted.
   */
  private setPageValues(subject: Subject): void {
    // Name field.
    let name = <HTMLInputElement>document.getElementById('subjectName');
    if (name !== null) { name.value = subject.name; }
    // Description field.
    let description = <HTMLTextAreaElement>document.getElementById('subjectDescription');
    if (description !== null) { description.value = subject.description; }
  }

  /**
   * Resets field values to initial values. (The current values for the subject pre-edit.)
   */
  private resetValues(): void {
    if (this.subject$ !== null) {
      this.setPageValues(this.subject$);
    }
  }


  /**
   * Validates inputs and sends request to api to edit subject.
   */
  private editSubject(): void {
    // Get subject object.
    let subject = this.buildSubject();
    // Ensure object received successfully / the user is actually changing something.
    if (subject == null) { return; }
    if (Object.keys(subject).length == 0) {
      this.errorMessage = 'You have not changed any values.';
      return;
    }
  
    // Submit if not already done.
    if (!this.submitted) {
      this.submitted = true;
      this.subjectService.editSubject(this.subject$.id, subject).subscribe(
        this.handleSuccess,
        this.handleFailure
      );
    }
  }

  /**
   * Builds object for the new subject values. Only adds attributes for value that are being changed.
   */
  private buildSubject(): object {
    let subject = {};
    // Name
    let name = (<HTMLInputElement>document.getElementById('subjectName')).value;
    if (name == '') {
      this.errorMessage = 'You must enter a name.';
      return null;
    }
    // If name is different from original, add it to object.
    if (name !== this.subject$.name) {
      subject['name'] = name;
    }

    // Description
    let description = (<HTMLTextAreaElement>document.getElementById('subjectDescription')).value;
    if (description !== this.subject$.description) {
      subject['description'] = description;
    }

    return subject;
  }


  // Event handlers for the api call.
  private handleSuccess = (res) => {
    // Redirect to updated subjects home.
    let route = environment.routes.subjectHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, res[0].id);
    this.router.navigate([ route ]);
  }

  private handleFailure = (err) => {
    switch (err.status) {
      case 400:     // Something wrong with request.
        this.errorMessage = err.error.message;
        break;
      case 401:     // User not admin.
        this.router.navigate([ environment.routes.subjectSelect ]);
        break;
      case 500:     // Server broke.
        this.errorMessage = 'Something went wrong with the server. Please try again later.'
        break;
    }
  }
}
