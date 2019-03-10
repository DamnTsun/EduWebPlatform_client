import { Component, OnInit } from '@angular/core';

import { Subject } from '../../../classes/Subject';
import { environment } from '../../../../environments/environment';
import { AuthService, SocialUser } from 'angularx-social-login';
import { SignInService } from 'src/app/services/sign-in.service';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';

@Component({
  selector: 'app-p-header',
  templateUrl: './p-header.component.html',
  styleUrls: ['./p-header.component.css']
})
export class PHeaderComponent implements OnInit {

  private routes: object;
  // store current subject / user as these can change appear of header.
  public subject$: Subject = null;
  public user$: SocialUser = null;
  public isAdmin$: boolean = false;



  constructor(
    private subjectService: SubjectsService,
    private signIn: SignInService
  ) { }

  ngOnInit() {
    // Store routes for easy use. (used when getting routerLink urls)
    this.routes = environment.routes;

    // Subscribe to current subject. (header changes when in / not in a subject)
    this.subjectService.subject().subscribe((subject) => {
      this.subject$ = subject;
    })

    // Subscribe to user logged in state. (changes Sign In to Account. Also adds Admin if appropriate (NOT IMPLEMENTED))
    this.signIn.user().subscribe((user) => {
      this.user$ = user;
    });
    // Subscribe to user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin$ = isAdmin;
    })
  }





  /**
   * Clears currently selected subject. Sets SiteService subject to null, which updates the header.
   */
  private clearSubject(): void {
    this.subjectService.clearSubject();
    //this.site.redirect(environment.routes.subjectSelect);
  }

  /**
   * Gets route for routerLink. Replaces route param keyword such as :subjectid with corresponding value.
   * @param route 
   */
  private getRoute(route: string): string {
    // Replace url parameters (':name') with corresponding values.
    // Subjectid.
    if (this.subject$ != null) {
      route = route.replace(`:${environment.routeParams.subjectid}`, this.subject$.id.toString());
    }
    return route;
  }


}
