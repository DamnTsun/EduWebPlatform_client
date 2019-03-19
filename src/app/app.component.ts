import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SubjectsService } from './services/contentServices/subjects.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'web-platform';

  constructor(
    private router: Router,                   // For adding events to router.
    private subjectService: SubjectsService   // For clearing current subject on /subjects route.
  ) {
    // Adding events to router.
    this.router.events.subscribe(e => {
      // On navigation end.
      if (e instanceof NavigationEnd) {
        // If route is /subjects.
        if (e.urlAfterRedirects === `/${environment.routes.subjectSelect}`) {
          // Clear the current subject in subjects service.
          // This will cause the nav bar to update to how it should be when not in a subject.
          this.subjectService.clearSubject();
        }
      }
    });
  }
}
