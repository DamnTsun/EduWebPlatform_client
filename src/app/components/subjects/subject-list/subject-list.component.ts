import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../services/site.service';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  private subjects$: object;


  constructor(private site: SiteService) { }


  ngOnInit() {
    this.site.getSubjects()
      .subscribe((subjects) => {
        this.subjects$ = subjects
    });
  }

}
