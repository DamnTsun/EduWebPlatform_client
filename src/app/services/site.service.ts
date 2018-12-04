import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';


/**
 * Site services.
 * Handles keeping track of things such as subjectId, topicId, etc.
 * Calls api service using stored ids to get corresponding records from api.
 */
@Injectable({
  providedIn: 'root'
})
export class SiteService {

  // *** Hold records currently in use, such as Subject record or Topic record, etc. ***
  // *** Component can subscribe to an Observable of the record, which pushes when record changes. ***
  // Subject
  private subjectRecord: BehaviorSubject<Subject> = new BehaviorSubject(null);
  public subject(): Observable<Subject> { return this.subjectRecord.asObservable(); }
  
  public setSubject(subjectId): void {
    this.api.getSubject(subjectId).subscribe((subjects) => {
      this.subjectRecord.next(subjects[0]);
    }, (err) => {
      console.error('SiteService: ', err);
      this.subjectRecord.next(null);
    });
  }

  public clearSubject(): void {
    this.subjectRecord.next(null);
    //this.clearTopic();
    //this.clearLesson();
    //this.clearTest();
  }



  // Topic
  // Lesson
  // Test

  constructor(
    private router: Router,
    private api: ApiService) { }

  public redirect(route: string): void {
    this.router.navigate([route]);
  }

  public getSubjects() {
    return this.api.getSubjects();
  }

  public getTopics(subjectId): Observable<Topic[]> {
    if (this.subjectRecord == null) { return null; }
    return this.api.getTopics(subjectId);
  }
}
