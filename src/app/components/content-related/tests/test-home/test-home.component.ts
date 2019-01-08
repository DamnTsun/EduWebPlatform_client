import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/classes/Test';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-home',
  templateUrl: './test-home.component.html',
  styleUrls: ['./test-home.component.css']
})
export class TestHomeComponent implements OnInit {

  private test$: Test = null;
  private loadingError: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private site: SiteService
  ) { }

  ngOnInit() {
    // Get ids from url.
    let subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    let topicid = this.route.snapshot.paramMap.get(environment.routeParams.topicid);
    let testid = this.route.snapshot.paramMap.get(environment.routeParams.testid);

    // Set subject id in site service based on url parameter.
    this.site.setSubject(subjectid);

    // Get test from api.
    this.site.getTest(subjectid, topicid, testid).subscribe((tests) => {
      this.test$ = tests[0];
    }, (err) => {
      this.loadingError = true;
      console.error('TestHome test$ Error:', err);
    });
  }

}
