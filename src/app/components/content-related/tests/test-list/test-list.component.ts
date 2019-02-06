import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/classes/Test';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  // Constants
  private count = 10;           // Number of test to get at a time.
  private offset = 0;           // How many tests have already been fetched.

  private subjectid = null;
  private topicid = null;
  private endOfContent: boolean = false;
  private isAdmin: boolean = false;
  private tests$: Test[] = [];


  constructor(
    private subjectService: SubjectsService,
    private testService: TestsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private navService: NavigationServiceService
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
      console.error('Test-List isAdmin error:', err);
    });


    // Get initial tests.
    this.getTests();
  }


  /**
   * Scroll event for infinite scroll.
   */
  private onScroll() {
    if (!this.endOfContent) {
      this.getTests();
    }
  }

  /**
   * Attempt to get more tests from api.
   */
  private getTests() {
    this.testService.getTests(this.subjectid, this.topicid, this.count, this.offset)
      .subscribe((tests: Test[]) => {
        if (tests.length > 0) {
          this.tests$ = this.tests$.concat(tests);
          this.offset += tests.length;
        } else {
          // Empty list. Must be end of tests.
          this.endOfContent = true;
        }
      }); 
  }



  /**
   * Deletes test with given index in array.
   * @param index - index of test.
   */
  private deleteTest(index) {
    // Check user is admin.
    if (!this.isAdmin) { return; }
    // Check index is valid.
    if (index < 0 || index >= this.tests$.length) { return; }
    // Get confirmation from user.
    if (!confirm(`Are you sure you want to delete test '${this.tests$[index].name}'?`)) { return; }

    // Attempt to delete.
    this.testService.deleteTest(this.subjectid, this.topicid, this.tests$[index].id).subscribe((res) => {
      // Successful. Remove from list.
      this.tests$ = this.tests$.filter((t, i, a) => {
        return i !== index;
      })
    }, (err) => {
      console.error('Test-List delete test error:', err);
    })
  }
}
