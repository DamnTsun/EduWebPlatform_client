import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, observable } from 'rxjs';

/**
 * Site services.
 * Handles keeping track of things such as subjectId, topicId, etc.
 * Calls api service using stored ids to get corresponding records from api.
 */
@Injectable({
  providedIn: 'root'
})
export class SiteService {

  // *** Ids for use with api, and corresponding Getters / Setters. ***
  // Subject
  private subjectId: number = null;
  public getSubjectId(): number  { return this.subjectId; }
  public setSubjectId(subjectId): void { this.subjectId = subjectId; console.log(subjectId); }
  public subjectSet(): boolean { return (this.subjectId !== null); }
  // Topic
  // Lesson
  // Test

  constructor(private api: ApiService) { }


  public getSubjects() {
    return this.api.getSubjects();
  }
}
