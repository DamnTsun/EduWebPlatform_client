import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { Post } from 'src/app/classes/Posts';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';

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
    private subjectService: SubjectsService
  ) { }


  ngOnInit() {
    this.subjectService.setSubject(this.route.snapshot.paramMap.get(environment.routeParams.subjectid));
  }

}
