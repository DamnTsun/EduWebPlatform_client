import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from '../../../classes/Subject';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../services/util.service';

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
    private site: SiteService,
    private util: UtilService) { }


  ngOnInit() {
    // Set subject id in site service based on url parameter.
    let subjectParam = this.util.getRouteParamName(environment.routeParams.subjectid);
    this.site.setSubject(this.route.snapshot.paramMap.get(subjectParam));
    
    // Subscribe to subject record to get its data.
    this.site.subject().subscribe((subject) => {
      this.subject$ = subject;
    }, (err) => {
      this.loadingError = true;
      console.error(err);
    });
  }

}
