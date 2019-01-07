import { Component, OnInit } from '@angular/core';
import { Topic } from '../../../classes/Topic';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../../../services/site.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-topic-home',
  templateUrl: './topic-home.component.html',
  styleUrls: ['./topic-home.component.css']
})
export class TopicHomeComponent implements OnInit {

  private topic$: Topic = null;
  private loadingError: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private site: SiteService
  ) { }


  ngOnInit() {
    // Set subject id in site service based on url parameter.
    this.site.setSubject(this.route.snapshot.paramMap.get(environment.routeParams.subjectid));
    
    // Get topic from api.
    this.site.getTopic(
      this.route.snapshot.paramMap.get(environment.routeParams.subjectid),
      this.route.snapshot.paramMap.get(environment.routeParams.topicid)
    ).subscribe((topics) => {
      if (topics != null) {
        this.topic$ = topics[0];
      }
    }, (err) => {
      console.error('Topic-Home Error:', err);
    });
  }

}
