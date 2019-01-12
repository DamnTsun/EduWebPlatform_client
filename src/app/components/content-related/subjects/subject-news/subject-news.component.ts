import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Post } from 'src/app/classes/Posts';

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
    private site: SiteService
  ) { }


  ngOnInit() {
    this.site.setSubject(this.route.snapshot.paramMap.get(environment.routeParams.subjectid));
  }

}
