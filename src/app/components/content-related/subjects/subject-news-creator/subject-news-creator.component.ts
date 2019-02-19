import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subject-news-creator',
  templateUrl: './subject-news-creator.component.html',
  styleUrls: ['./subject-news-creator.component.css']
})
export class SubjectNewsCreatorComponent implements OnInit {

  private subjectid = null;
  public submitted: boolean = false;        // Whether user has submitted subject.
  public errorMessage: string = null;       // Error message to display if something goes wrong.

  // Holds current values. Used by preview.
  public titleValue: string = '';
  public bodyValue: string = '';





  constructor(
    private subjectService: SubjectsService,        // For setting subject and methods for interacting with api.
    private signIn: SignInService,                  // For checking user is an admin.
    private route: ActivatedRoute,                  // For getting route params.
    private router: Router,                         // For redirecting user if necessary.
    private navService: NavigationServiceService    // For getting routes, such as for breadcrumb navigation.
  ) { }

  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(this.subjectid);


    // Check user is an admin.
    this.signIn.userIsAdmin().subscribe((isAdmin: boolean) => {
      // If not admin, redirect to subject news list.
      if (!isAdmin) {
        this.router.navigate([
          this.navService.getSubjectNewsRoute(this.subjectid)
        ]);
      }
    }, (err) => {
      console.error('SubjectNewsCreator user admin status Error:', err);
    });


    // Watch current values of title / body.
    document.getElementById('postTitle').addEventListener('input', (e) => {
      this.titleValue = (<HTMLInputElement>e.target).value;
    });
    document.getElementById('postBody').addEventListener('input', (e) => {
      this.bodyValue = (<HTMLTextAreaElement>e.target).value;
    });
  }



  /**
   * Validates inputs and sends request to api to create a post if valid.
   */
  public createPost(): void {
    // Get post, ensure valid.
    let post = this.buildPost();
    if (post === null) { return; }

    // If page hasn't been submitted.
    if (!this.submitted) {
      this.submitted = true;
      this.subjectService.createPost(this.subjectid, post).subscribe(
        this.handleSuccess,
        this.handleError
      )
    }
  }


  /**
   * Builds a post object based on current values on page and returns it.
   * Will return null if current values are invalid.
   */
  private buildPost(): object {
    let post = {
      title: null,
      body: null
    };

    // Attempt to get title.
    let titleInput = <HTMLInputElement>document.getElementById('postTitle');
    if (titleInput == null ||
        titleInput.value == null ||
        titleInput.value.trim() == '') {
          this.errorMessage = 'You must enter a title.';
          return null;
        }
    post.title = titleInput.value.trim();


    // Attempt to get body.
    let bodyInput = <HTMLTextAreaElement>document.getElementById('postBody');
    if (bodyInput == null || bodyInput.value == null) { return null; }
    post.body = bodyInput.value.trim();


    return post;
  }



  // Handlers for api request.
  // Handles successful request.
  private handleSuccess = (res) => {
    // Redirect back to news list. Created post should be at top.
    this.router.navigate([
      this.navService.getSubjectNewsRoute(this.subjectid)
    ])
  }

  // Handles failed request.
  private handleError = (err) => {
    switch (err.status) {
      case 400: // Bad request. Inputs weren't valid.
        this.errorMessage = err.error.message;
        this.submitted = false;
        break;
      case 500: // Internal server error. Server messed up.
        this.errorMessage = 'Sorry, something went wrong with the server. Please try again later.';
        break;

      default: // Unexpected error.
        console.error('SubjectNewsCreator create post - unexpected http Error:', err);
        break;
    }
  }
}
