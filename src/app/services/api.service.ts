import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';
import { Post } from '../classes/Posts';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }


  // *** SUBJECTS ***
  // Get 1
  public getSubject(subjectId: number): Observable<Subject[]> {
    return this.http.get(environment.apiUrl + `subjects/${subjectId}`) as Observable<Subject[]>;
  }

  // Get all
  public getSubjects(): Observable<Subject[]> {
    return this.http.get(environment.apiUrl + 'subjects') as Observable<Subject[]>;
  }

  // Get news posts.
  public getPosts(subjectId: number, count: number, offset: number): Observable<Post[]> {
    return this.http.get(environment.apiUrl +
      `subjects/${subjectId}/posts?count=${count}&offset=${offset}`) as Observable<Post[]>;
  }


  // TOPICS
  public getTopics(subjectId: number): Observable<Topic[]> {
    return this.http.get(environment.apiUrl + `subjects/${subjectId}/topics`) as Observable<Topic[]>;
  }
}
