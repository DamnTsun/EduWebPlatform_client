import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../../classes/Posts';
import { UtilService } from '../../../services/util.service';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-subject-news',
  templateUrl: './subject-news.component.html',
  styleUrls: ['./subject-news.component.css']
})
export class SubjectNewsComponent implements OnInit {

  private posts$: Post[];
  private loadingError: boolean;


  constructor(
    private route: ActivatedRoute,
    private site: SiteService,
    private util: UtilService
  ) { }


  ngOnInit() {
    this.site.setSubject(this.route.snapshot.paramMap.get(environment.routeParams.subjectid));
  }

}
