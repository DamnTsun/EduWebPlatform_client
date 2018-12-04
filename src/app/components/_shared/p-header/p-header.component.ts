import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';

import { Subject } from '../../../classes/Subject';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-p-header',
  templateUrl: './p-header.component.html',
  styleUrls: ['./p-header.component.css']
})
export class PHeaderComponent implements OnInit {

  private routes: object;
  private subject$: Subject = null;

  constructor(private site: SiteService) { }

  ngOnInit() {
    this.routes = environment.routes;
    this.site.subject().subscribe((subject) => {
      this.subject$ = subject;
    })
  }

  private clearSubject(): void {
    this.site.clearSubject();
    this.site.redirect(environment.routes.subjectSelect);
  }

  /**
   * Gets route for routerLink. Replaces route param keyword such as :subjectid with corresponding value.
   * @param route 
   */
  private getRoute(route: string): string {
    let updated: string = '';
    // Check each section of url.
    let slugs: string[] = route.split('/');
    for (let i = 0; i < slugs.length; i++) {
      // SubjectId
      if (slugs[i] === environment.routeParams.subjectid) { slugs[i] = this.subject$.id.toString(); }
      
      updated += '/' + slugs[i];
    }
    return updated;
  }
}
