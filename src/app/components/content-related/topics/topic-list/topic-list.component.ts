import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { Topic } from 'src/app/classes/Topic';

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
    let subjectId = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
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
