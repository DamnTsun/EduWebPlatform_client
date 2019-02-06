import { Component, OnInit } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { UserTestsService } from 'src/app/services/user/user-tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { environment } from 'src/environments/environment';
import { UserTestQuestion } from 'src/app/classes/UserTestQuestion';

@Component({
  selector: 'app-user-test-details',
  templateUrl: './user-test-details.component.html',
  styleUrls: ['./user-test-details.component.css']
})
export class UserTestDetailsComponent implements OnInit {

  // Ids of parent objects.
  private subjectid = null;
  private topicid = null;
  private testid = null;
  private utestid = null;

  private utestQuestions = [];


  constructor(
    private subjectService: SubjectsService,      // For setting subject.
    private userTestService: UserTestsService,    // For getting user test questions.
    private signIn: SignInService,                // For checking user is signed in.
    private route: ActivatedRoute,                // For getting route params.
    private router: Router,                       // For redirect user if needed.
    private navService: NavigationServiceService  // For getting routes for redirects.
  ) { }

  ngOnInit() {
    // Get route parameters.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    this.testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);
    this.utestid = this.route.snapshot.paramMap.get(environment.routeParams.usertestid);
    // Set subject.
    this.subjectService.setSubject(this.subjectid);


    // Get user signed in
    this.signIn.user().subscribe((user) => {
      // If not signed in, redirect to test home.
      if (user == null) {
        this.router.navigate([
          this.navService.getTestHomeRoute(
            this.subjectid, this.topicid, this.testid
          )
        ]);
      }
    }, (err) => {
      console.error('UserTestDetails sign in Error:', err);
    });


    // Get user test questions.
    this.userTestService.getUserTestQuestionResults(
      this.subjectid, this.topicid, this.testid, this.utestid)
      .subscribe((questions: UserTestQuestion[]) => {
        this.utestQuestions = questions;
        console.log(questions);
    }, (err) => {
      console.error('UserTestDetails getDetails Error:', err);
    })
  }


  
  /**
   * Gets number of test question results where the user has chosen the correct answer.
   */
  public getCorrectQuestionCount() {
    return this.utestQuestions.reduce((acc, { userAnswer, correctAnswer}) => {
      if (userAnswer == correctAnswer) { return acc + 1; }
      return acc;
    }, 0);
  }
}
