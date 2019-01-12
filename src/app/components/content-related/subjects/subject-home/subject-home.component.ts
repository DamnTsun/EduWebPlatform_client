import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from 'src/app/services/site.service';
import { environment } from 'src/environments/environment';

import { Subject } from 'src/app/classes/Subject';

@Component({
  selector: 'app-subject-home',
  templateUrl: './subject-home.component.html',
  styleUrls: ['./subject-home.component.css']
})
export class SubjectHomeComponent implements OnInit {

  private subject$: Subject;
  private loadingError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private site: SiteService
  ) { }


  ngOnInit() {
    // Set subject id in site service based on url parameter.
    this.site.setSubject(this.route.snapshot.paramMap.get(environment.routeParams.subjectid));
    
    // Subscribe to subject record to get its data.
    this.site.subject().subscribe((subject) => {
      this.subject$ = subject;
    }, (err) => {
      this.loadingError = true;
      console.error(err);
    });
  }

}
