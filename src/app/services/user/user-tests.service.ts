import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { TestQuestion } from 'src/app/classes/TestQuestion';
import { Observable } from 'rxjs';
import { UserTest } from 'src/app/classes/UserTest';
import { environment } from 'src/environments/environment';

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
   * Sends a user_test object to the API so that it can be saved.
   * @param user_test - user_test object.
   */
  public addUserTest(user_test): Observable<UserTest[]> {
    let data = new FormData();
    data.set('content', JSON.stringify(user_test));
    return this.api.post(environment.apiUrl + `users/user_tests`, data) as Observable<UserTest[]>;
  }





  /**
   * Deletes all of the current users test results.
   */
  public deleteAllCurrentUserUserTests() {
    return this.api.delete(environment.apiUrl + `users/user_tests`);
  }
}
