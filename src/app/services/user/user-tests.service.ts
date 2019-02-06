import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { TestQuestion } from 'src/app/classes/TestQuestion';
import { Observable } from 'rxjs';
import { UserTest } from 'src/app/classes/UserTest';
import { environment } from 'src/environments/environment';
import { UserTestQuestion } from 'src/app/classes/UserTestQuestion';

@Injectable({
  providedIn: 'root'
})
export class UserTestsService {

  constructor(
    private api: ApiService
  ) { }





  /**
   * Gets specified number of questions in a test, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param count - number of questions.
   */
  public getUserTestQuestions(subjectid, topicid, testid, count): Observable<TestQuestion[]> {
    return this.api.get(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}/questions/random?count=${count}`) as Observable<TestQuestion[]>;
  }





  /**
   * Gets previous user test results from api for a specific test (by id).
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public getUserTestResults(subjectid, topicid, testid): Observable<UserTest[]> {
    return this.api.get(environment.apiUrl +
        `subjects/${subjectid}/topics/${topicid}/tests/${testid}/user_tests`) as Observable<UserTest[]>;
  }



  /**
   * Gets user test questions that were part of the specified user test.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param utestid - id of user test.
   */
  public getUserTestQuestionResults(subjectid, topicid, testid, utestid): Observable<UserTestQuestion[]> {
    return this.api.get(environment.apiUrl +
        `subjects/${subjectid}/topics/${topicid}/tests/${testid}/user_tests/${utestid}/questions`) as Observable<UserTestQuestion[]>;
  }



  /**
   * Sends a user_test object to the API so that it can be saved.
   * @param user_test - user_test object.
   */
  public addUserTest(subjectid, topicid, testid, user_test): Observable<UserTest[]> {
    let data = new FormData();
    data.set('content', JSON.stringify(user_test));
    return this.api.post(environment.apiUrl +
        `subjects/${subjectid}/topics/${topicid}/tests/${testid}/user_tests`,
        data) as Observable<UserTest[]>;
  }



  /**
   * Deletes a users user_test.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param utestid - id of user_test.
   */
  public deleteUserTest(subjectid, topicid, testid, utestid) {
    return this.api.delete(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/tests/${testid}/user_test/${utestid}`);
  }



  /**
   * Deletes all of the current users test results.
   */
  public deleteAllCurrentUserUserTests() {
    return this.api.delete(environment.apiUrl + `users/user_tests`);
  }
}
