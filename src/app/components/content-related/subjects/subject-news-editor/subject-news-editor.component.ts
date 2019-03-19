import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/classes/Posts';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subject-news-editor',
  templateUrl: './subject-news-editor.component.html',
  styleUrls: ['./subject-news-editor.component.css']
})
export class SubjectNewsEditorComponent implements OnInit {

  public subjectid = null;
  public post$: Post = null;           // Post being editted.
  public submitted: boolean = false;
  public errorMessage: string = null;

  // Holds current values for page for use on preview.
  public titleValue: string = '';
  public bodyValue: string = '';





  constructor(
    private subjectService: SubjectsService,          // For interacting with api.
    private signIn: SignInService,                    // For getting user admin status.
    private route: ActivatedRoute,                    // For getting route params.
    private router: Router,                           // For redirecting user if necessary.
    public navService: NavigationServiceService       // For use with breadcrumb navigation.
  ) { }

  ngOnInit() {
    // Get route params and set subject.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let postid = this.route.snapshot.paramMap.get(environment.routeParams.postid);
    this.subjectService.setSubject(this.subjectid);


    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin: boolean) => {
      if (!isAdmin) {
        this.router.navigate([
          this.navService.getSubjectNewsRoute(this.subjectid)
        ]);
      }
    }, (err) => {
      console.error('SubjectNewsEditor user admin status Error:', err);
    });


    // Get post being editted.
    this.subjectService.getPost(this.subjectid, postid).subscribe((post: Post[]) => {
      this.post$ = post[0];
      this.setPageValues(this.post$);
    }, (err) => {
      console.error('SubjectNewsEditor get post Error:', err);
    })


    // Watch updates to inputs.
    document.getElementById('postTitle').addEventListener('input', (e) => {
      this.titleValue = (<HTMLInputElement>e.target).value.trim();
    });
    document.getElementById('postBody').addEventListener('input', (e) => {
      this.bodyValue = (<HTMLTextAreaElement>e.target).value.trim();
    });
  }


  /**
   * Sets values of inputs on forms based on given post object.
   * @param post - post being editted.
   */
  private setPageValues(post: Post): void {
    // Title
    let title = <HTMLInputElement>document.getElementById('postTitle');
    if (title !== null) { title.value = post.title; }
    this.titleValue = post.title;

    // Body
    let body = <HTMLTextAreaElement>document.getElementById('postBody');
    if (body !== null) { body.value = post.body; }
    this.bodyValue = post.body;
  }

  /**
   * Resets values of inputs back to initial values. UNUSED
   */
  private resetValues(): void {
    if (this.post$ !== null) {
      this.setPageValues(this.post$);
    }
  }



  /**
   * Validates inputs and edits the post if valid.
   */
  public editPost(): void {
    // Get and validate post.
    let post = this.buildPost();
    if (post == null) { return; }
    if (Object.keys(post).length == 0) {
      this.errorMessage = 'You have not changed any values.';
      return;
    }

    // Submit if allowed.
    if (!this.submitted) {
      this.submitted = true;
      this.subjectService.editPost(this.subjectid, this.post$.id, post)
        .subscribe(
          this.handleSuccess,
          this.handleFailure
      )
    }
  }


  /**
   * Attemps to build an object containing new values for post. Only adds attributes for values that have changed.
   * Will return null if inputs are invalid.
   * Will return {} if no inputs have changed.
   */
  private buildPost(): object {
    let post = {};
    // Title
    let title = (<HTMLInputElement>document.getElementById('postTitle')).value;
    if (title.trim() == '') {
      this.errorMessage = 'You must enter a title.';
      return null;
    }
    // If title is different, add it to object.
    if (title !== this.post$.title) {
      post['title'] = title;
    }


    // Body
    let body = (<HTMLTextAreaElement>document.getElementById('postBody')).value;
    if (body !== this.post$.body) {
      post['body'] = body;
    }

    return post;
  }


  


  // Handlers for api call.
  // Handle successful request.
  private handleSuccess = (res) => {
    // Redirect to subject news list.
    this.router.navigate([
      this.navService.getSubjectNewsRoute(this.subjectid)
    ]);
  }

  // Handle failed request.
  private handleFailure = (err) => {
    switch (err.status) {
      case 400:   // Bad request.
        this.errorMessage = err.error.message;
        break;
      case 500:   // Internal server error.
        this.errorMessage = 'Something went wrong with the server. Please try again later.';
        break;
    }
  }
}
