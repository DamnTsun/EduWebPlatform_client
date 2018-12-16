import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';

import { Subject } from '../../../classes/Subject';
import { environment } from '../../../../environments/environment';
import { AuthService, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-p-header',
  templateUrl: './p-header.component.html',
  styleUrls: ['./p-header.component.css']
})
export class PHeaderComponent implements OnInit {

  private routes: object;
  private subject$: Subject = null;

  private user$: SocialUser = null;



  constructor(
    private site: SiteService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    // Store routes for easy use. (used when getting routerLink urls)
    this.routes = environment.routes;
    // Subscribe to current subject. (header changes when in / not in a subject)
    this.site.subject().subscribe((subject) => {
      this.subject$ = subject;
    })
    // Subscribe to user logged in state. (changes Sign In to Account. Also adds Admin if appropriate (NOT IMPLEMENTED))
    this.auth.authState.subscribe((user) => {
      this.user$ = user;
    });
  }



  /**
   * Clears currently selected subject. Sets SiteService subject to null, which updates the header.
   */
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



  /**
   * Returns whether the current user is signed into the platform.
   */
  private isUserSignedIn(): boolean {
    return (this.user$ !== null);
  }
}
