import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';
import { Post } from '../classes/Posts';
import { Lesson } from '../classes/Lesson';
import { Test } from '../classes/Test';

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
    return this.http.get(environment.apiUrl +
      `subjects/${subjectId}/topics`) as Observable<Topic[]>;
  }
  public getTopic(subjectid: number, topicid: number) {
    return this.http.get(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`
    ) as Observable<Topic[]>;
  }


  // LESSONS
  public getLessons(subjectid: number, topicid: number): Observable<Lesson[]> {
    return this.http.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/lessons`) as Observable<Lesson[]>;
  }


  // TESTS
  public getTests(subjectid: number, topicid: number): Observable<Test[]> {
    return this.http.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/tests`) as Observable<Test[]>;
  }
}
