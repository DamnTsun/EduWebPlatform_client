import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Subject } from 'src/app/classes/Subject';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';

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
    private subjectService: SubjectsService
  ) { }


  ngOnInit() {
    // Set subject id in site service based on url parameter.
    this.subjectService.setSubject(this.route.snapshot.paramMap.get(environment.routeParams.subjectid));
    
    // Subscribe to subject record to get its data.
    this.subjectService.subject().subscribe((subject) => {
      this.subject$ = subject;
    }, (err) => {
      this.loadingError = true;
      console.error(err);
    });
  }

}
