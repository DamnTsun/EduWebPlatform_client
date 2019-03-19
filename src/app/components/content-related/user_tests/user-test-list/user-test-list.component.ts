import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { UserTestsService } from 'src/app/services/user/user-tests.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserTest } from 'src/app/classes/UserTest';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';

@Component({
  selector: 'app-user-test-list',
  templateUrl: './user-test-list.component.html',
  styleUrls: ['./user-test-list.component.css']
})
export class UserTestListComponent implements OnInit {

  // Constants for timespan values.
  public static readonly TIMESPANS = {
    ALL_TIME: 'all-time',
    MONTH: 'month'
  };

  // Constants.
  private count: number = 18;
  private offset: number = 0;
  private timespan: string = null;

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


    // Get timespan for user tests. Set to null if not a supported value.
    this.timespan = this.route.snapshot.paramMap.get('timespan');
    if (UserTestListComponent.validateTimespanValue(this.timespan)) {
      this.timespan = null;
    }

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
   * Gets user test results for display. Results looked up depends on value of timespan.
   */
  private getUserTestResults(): void {
    // Use get method corresponding to timespan.
    switch (this.timespan) {
      case null:
      case UserTestListComponent.TIMESPANS.ALL_TIME:
        this.getUserTestResults_allTime();
        break;
      case UserTestListComponent.TIMESPANS.MONTH:
        this.getUserTestResults_month();
        break;
      // Shouldn't be reached, but if it is, get all time results.
      default:
        this.getUserTestResults_allTime();
        break;
    }
  }


  /**
   * Attempts to get user tests from API.
   * Looks up all tests completed.
   */
  private getUserTestResults_allTime(): void {
    this.userTestService.getUserTestResults(this.subjectid,
      this.topicid, this.testid, this.count, this.offset, 'all-time')
      .subscribe(this.handleSuccess, this.handleFailure);
  }

  /**
   * Attempts to get user tests from API.
   * Looks up tests completed within the last 30 days.
   */
  private getUserTestResults_month(): void {
    this.userTestService.getUserTestResults(this.subjectid,
      this.topicid, this.testid, this.count, this.offset, 'month')
      .subscribe(this.handleSuccess, this.handleFailure);
  }


  // Handles success/failure when performing API request.
  private handleSuccess = (results: UserTest[]) => {
    if (results.length > 0) {
      this.userTestResults$ = this.userTestResults$.concat(results);
      this.offset += results.length;
      // If less results returned than asked for, must be end of results.
      if (results.length < this.count) {
        this.endOfContent = true;
      }

      // Add results to chart.
      results.forEach(r => this.addResultToChart(r));
    } else {
      // Empty list returned, must be end of results.
      this.endOfContent = true;
    }
  }
  private handleFailure = (err) => {
    console.error('UserTestList getResults error:', err);
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
    this.router.navigate([route]);
  }





  // HTML methods.
  /**
   * Gets text for the timespan section of the title text.
   */
  public getTimespanForTitle(): string {
    switch (this.timespan) {
      case null:
      case UserTestListComponent.TIMESPANS.ALL_TIME:
        return 'All-Time';
      case UserTestListComponent.TIMESPANS.MONTH:
        return 'Last 30 Days';

      default:
        return 'All-Time';
    }
  }

  /**
   * Get url parameter object for when navigating to user tests list via breadcrumb nav.
   */
  public getTimespanParamForNavigation(): Object {
    let params = {};
    if (this.timespan !== null) { params['timespan'] = this.timespan; }
    return params;
  }

  /**
   * Gets user test score as a percentage.
   * @param { score, questionCount } - score/questionCount attributes of given UserTest object.
   */
  public getScorePercentage({ score, questionCount }: UserTest): number {
    return Math.floor((score / questionCount) * 100);
  }













  /**
   * Checks that the given string is an item of the TIMESPANS array.
   * @param value - value to be checked.
   */
  public static validateTimespanValue(value: string) {
    
    // Convert TIMESPANS to array and check if value is an element.
    return !Object.values(this.TIMESPANS).includes(value);
  }




  
  // Variables for chart.
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // Stores data for chart.
  public lineChartData: number[] = [];
  // Stores labels for chart.
  public lineChartLabels: Label[] = [];
  // Stores options for chart.
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{
        ticks: {
          maxTicksLimit: 6,
          maxRotation: 30
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            fontSize: 12,
            beginAtZero: true
          }
        }
      ]
    }
  };
  // Defines color of line and under-line area of chart.
  public lineChartColors: Color[] = [
    { // blue
      backgroundColor: 'rgba(60,108,231,0.3)',
      borderColor: 'rgba(60,108,231,1)',
      pointBackgroundColor: 'rgba(92,140,231,1)',
      pointBorderColor: 'rgba(255,255,255,1)',
      pointRadius: 4
    }
  ];
  public lineChartType = 'line';


  /**
   * Adds a new result to the chart.
   * The y position is based on the score perecentage.
   * The x label is the date of completion, formatted.
   * @param result - User test to be plotted.
   */
  private addResultToChart(result: UserTest) {
    // Get score.
    let score = this.getScorePercentage(result);
    // Format date to look nice.
    let dateString = new Date(result.date).toLocaleString().replace(/\:\d\d /g, ' ');
    // Add to data / labels of chart.
    this.lineChartLabels.unshift(dateString);
    this.lineChartData.unshift(score);
    this.chart.update();
  }
}
