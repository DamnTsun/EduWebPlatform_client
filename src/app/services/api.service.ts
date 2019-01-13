import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';
import { Post } from '../classes/Posts';
import { Lesson } from '../classes/Lesson';
import { Test } from '../classes/Test';
import { AuthObject } from '../classes/AuthObject';
import { TestQuestion } from '../classes/TestQuestion';
import { UserTest } from '../classes/UserTest';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Holds authorization data, such as the JWT for when making requests.
  private authObject: AuthObject = null;





  constructor(private http: HttpClient) { }





  // *** HEADER INJECTION ***
  // Injects JWT as header 'HTTP_IDTOKEN' if user is signed in.
  /**
   * Adds HTTP_IDTOKEN header if auth object is set.
   * @param headers 
   */
  private createAuthorizationHeader() {
    let headers = new HttpHeaders();
    if (this.authObject !== null) {
      headers = headers.set('idToken', this.authObject.idToken);
    }
    return headers;
  }

  /**
   * Performs get request. Automatically injects authentification header if possible.
   * @param url - url of request.
   */
  private get(url) {
    let headers = this.createAuthorizationHeader();
    return this.http.get(url, {
      headers: headers
    });
  }
  /**
   * Performs post request. Automatically injects authentification header if possible.
   * @param url - url of request.
   * @param body - body of request.
   */
  private post(url, body) {
    let headers = this.createAuthorizationHeader();
    return this.http.post(url, body, {
      headers: headers
    });
  }
  /**
   * Performs delete request. Automatically injects authentification header if possible.
   * @param url - url of request.
   */
  private delete(url) {
    let headers = this.createAuthorizationHeader();
    return this.http.delete(url, {
      headers: headers
    });
  }










  // *** AUTHORIZING WITH BACKEND ***
  /**
   * Sets authorization object. Contains JWT for request headers.
   * @param authObject - Authorization object.
   */
  public setAuthObject(authObject: AuthObject): void {
    this.authObject = authObject;
    console.log(this.authObject);
  }
  /**
   * Clears authorization object.
   */
  public clearAuthObject(): void {
    this.authObject = null;
  }





  /**
   * Authorizes with backend api using Google id_token.
   * @param google_id_token - id_token from Google for signed in user.
   */
  public authorizeWithBackendGoogle(google_id_token: string): Observable<AuthObject> {
    // Build form data. (Backend uses x-www-form-urlencoded)
    let data = new FormData();
    data.set('google_id_token', google_id_token);
    return this.post(environment.apiUrl +
      `users/auth/google`, data) as Observable<AuthObject>;
  }
  /**
   * Authorizes with backend api using Facebook auth_token.
   * @param google_id_token - id_token from Google for signed in user.
   */
  public authorizeWithBackendFacebook(facebook_auth_token: string): Observable<AuthObject> {
    // Build form data. (Backend uses x-www-form-urlencoded)
    let data = new FormData();
    data.set('facebook_id_token', facebook_auth_token);
    return this.post(environment.apiUrl +
      `users/auth/facebook`, data) as Observable<AuthObject>;
  }
  // *** END OF AUTHORIZATION ***










  // *** GENERAL CONTENT ***
  // SUBJECTS
  /**
   * Gets all subjects.
   */
  public getSubjects(): Observable<Subject[]> {
    return this.get(environment.apiUrl + 'subjects') as Observable<Subject[]>;
  }
  /**
   * Get a subject by id.
   * @param subjectId - id of subject.
   */
  public getSubject(subjectId: number): Observable<Subject[]> {
    return this.get(environment.apiUrl + `subjects/${subjectId}`) as Observable<Subject[]>;
  }

  /**
   * Deletes a subject.
   * @param subjectid - id of subject.
   */
  public deleteSubject(subjectid: number) {
    return this.delete(environment.apiUrl + `subjects/${subjectid}`);
  }



  // POSTS
  /**
   * Gets posts inside of subject.
   * @param subjectId - id of subject.
   * @param count - number of posts to get.
   * @param offset - number of posts to skip.
   */
  public getPosts(subjectId: number, count: number, offset: number): Observable<Post[]> {
    return this.get(environment.apiUrl +
      `subjects/${subjectId}/posts?count=${count}&offset=${offset}`) as Observable<Post[]>;
  }



  // TOPICS
  /**
   * Get all topics inside a subject.
   * @param subjectId - id of subject.
   */
  public getTopics(subjectId: number): Observable<Topic[]> {
    return this.get(environment.apiUrl +
      `subjects/${subjectId}/topics`) as Observable<Topic[]>;
  }
  /**
   * Gets a topic by id, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getTopic(subjectid: number, topicid: number) {
    return this.get(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`
    ) as Observable<Topic[]>;
  }

  /**
   * Deletes a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public deleteTopic(subjectid: number, topicid: number) {
    return this.delete(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`);
  }



  // LESSONS
  /**
   * Gets all lessons inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getLessons(subjectid: number, topicid: number): Observable<Lesson[]> {
    return this.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/lessons`) as Observable<Lesson[]>;
  }
  /**
   * Geta lesson by id, inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonid id of lesson.
   */
  public getLesson(subjectid: number, topicid: number,
    lessonid: number): Observable<Lesson[]> {
    return this.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}
        /lessons/${lessonid}`
    ) as Observable<Lesson[]>;
  }



  // TESTS
  /**
   * Gets all tests inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getTests(subjectid: number, topicid: number): Observable<Test[]> {
    return this.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/tests`) as Observable<Test[]>;
  }
  /**
   * Gets a test by id, inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public getTest(subjectid: number, topicid: number,
    testid: number): Observable<Test[]> {
    return this.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}
        /tests/${testid}`
    ) as Observable<Test[]>;
  }



  // USER TESTS
  /**
   * Gets specified number of test questions inside a test, inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param count - number of questions to get.
   */
  public getUserTestQuestions(subjectid: number, topicid: number,
    testid: number, count: number = 10): Observable<TestQuestion[]> {
      return this.get(environment.apiUrl +
        `subjects/${subjectid}/topics/${topicid}
          /tests/${testid}/questions/random?count=${count}`) as Observable<TestQuestion[]>;
  }

  /**
   * Sends given user_test object to api to be saved.
   * @param user_test - user test object.
   */
  public addUserTest(user_test): Observable<UserTest[]> {
    let data = new FormData();
    data.set('content', JSON.stringify(user_test));
    return this.post(environment.apiUrl + 'users/user_tests', data) as Observable<UserTest[]>;
  }
  // *** END OF GENERAL CONTENT ***


}
