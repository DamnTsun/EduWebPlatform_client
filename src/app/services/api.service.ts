import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  // SUBJECTS
  public getSubject(subjectId: number): Observable<Subject[]> {
    return this.http.get(environment.apiUrl + `subjects/${subjectId}`) as Observable<Subject[]>;
  }

  public getSubjects(): Observable<Subject[]> {
    return this.http.get(environment.apiUrl + 'subjects') as Observable<Subject[]>;
  }


  // TOPICS
  public getTopics(subjectId: number): Observable<Topic[]> {
    return this.http.get(environment.apiUrl + `subjects/${subjectId}/topics`) as Observable<Topic[]>;
  }
}
