import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestQuestionsService {

  constructor(
    private api: ApiService
  ) { }


  /**
   * Gets test questions inside of a test, inside a topic, inside of subject.
   * Only possible if admin idToken passed to server. - Aka user is signed in AND admin.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public getTestQuestions(subjectid, topicid, testid, count, offset) {
    return this.api.get(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}/questions?count=${count}&offset=${offset}`);
  }
}
