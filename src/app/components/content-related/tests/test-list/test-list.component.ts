import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/classes/Test';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { TestsService } from 'src/app/services/contentServices/tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    private route: ActivatedRoute
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
}
