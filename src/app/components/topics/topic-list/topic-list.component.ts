import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../services/util.service';
import { environment } from '../../../../environments/environment';
import { Topic } from '../../../classes/Topic';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {

  private topics$: Topic[];
  private loadingError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private site: SiteService,
    private util: UtilService
  ) { }

  ngOnInit() {
    // Set subjectid to set subject. Then get associated topics.
    let subjectParam = this.util.getRouteParamName(environment.routeParams.subjectid);
    let subjectId = this.route.snapshot.paramMap.get(subjectParam);
    this.site.setSubject(subjectId);

    // Subscribe to topics.
    this.site.getTopics(subjectId).subscribe((topics) => {
      this.topics$ = topics;
    }, (err) => {
      this.loadingError = true;
      console.error(err);
    })
  }

}
