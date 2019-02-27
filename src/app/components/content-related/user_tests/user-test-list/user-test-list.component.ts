import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { UserTestsService } from 'src/app/services/user/user-tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserTest } from 'src/app/classes/UserTest';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-user-test-list',
  templateUrl: './user-test-list.component.html',
  styleUrls: ['./user-test-list.component.css']
})
export class UserTestListComponent implements OnInit {

  // Constants.
  private count: number = 18;
  private offset: number = 0;

  // Ids of parent objects.
  public subjectid = null;
  public topicid = null;
  public testid = null;

  public userTestResults$ = [];
  public endOfContent: boolean = false;


  constructor(
    private subjectService: SubjectsService,          // For setting subject.
    private userTestService: UserTestsService,        // For interactign with user_tests part of api.
    private signIn: SignInService,                    // For checking user signin/admin status.
    private route: ActivatedRoute,                    // For getting route params.
    private router: Router,                           // For redirecting user if needed.
    public navService: NavigationServiceService      // For getting routes for breadcrumb nav.
  ) { }

  ngOnInit() {
    // Get route parameters.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);

    
    // Get user admin status.
    this.signIn.user().subscribe((user) => {
      // If not signed in, redirect to test home.
      if (user == null) {
        this.redirectToTestHome();
      }
    }, (err) => {
      console.error('UserTestList sign in error:', err);
    })


    // Get inital results for displaying.
    this.getUserTestResults();
  }


  /**
   * Scroll event for infinite scroll.
   * Attempts to get more results from api, unless no more exist.
   */
  public onScroll(): void {
    if (!this.endOfContent) {
      this.getUserTestResults();
    }
  }


  /**
   * Attempts to get more user test results from api.
   * If successful, will append them to end of userTestResults$ array.
   */
  private getUserTestResults(): void {
    this.userTestService.getUserTestResults(this.subjectid, this.topicid, this.testid, this.count, this.offset).subscribe((results: UserTest[]) => {
      if (results.length > 0) {
        this.userTestResults$ = this.userTestResults$.concat(results);
        this.offset += results.length;
        // If less results returned than asked for, must be end of results.
        if (results.length < this.count) {
          this.endOfContent = true;
        }
      } else {
        // Empty list returned, must be end of results.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('UserTestList getResults error:', err);
    });
  }





  // Holds index of user test to be deleted. Used by delete modal.
  public deleteUserTestIndex = null;
  /**
   * Deletes user test at given index from userTestResults$ array.
   * @param index - index of user test in userTestResults$ array.
   */
  public deleteUserTest(index) {
    // Check index valid.
    if (index < 0 || index >= this.userTestResults$.length) {
      return;
    }

    // Attempt to delete.
    this.userTestService.deleteUserTest(this.subjectid, this.topicid, this.testid,
      this.userTestResults$[index].id).subscribe((res) => {
        // Successful. Remove from array.
        this.userTestResults$ = this.userTestResults$.filter((ele, i) => { return i !== index; });
    }, (err) => {
      console.error('UserTestList delete result Error:', err);
    })
  }





  /**
   * Redirects user to test home area. (Based on current 'testid' url param)
   */
  private redirectToTestHome() {
    // Get route and replace param names with corresponding values.
    let route = environment.routes.testHome;
    route = route.replace(`:${environment.routeParams.subjectid}`, this.subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, this.topicid);
    route = route.replace(`:${environment.routeParams.testid}`, this.testid);
    // Navigate to route.
    this.router.navigate([ route ]);
  }




  
  // HTML methods.
  /**
   * Gets user test score as a percentage.
   * @param { score, questionCount } - score/questionCount attributes of given UserTest object.
   */
  public getScorePercentage({ score, questionCount }: UserTest): number {
    return Math.floor((score / questionCount) * 100);
  }
}
