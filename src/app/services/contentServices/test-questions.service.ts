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
   * Gets a test question, in a test, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param testquestionid - id of test question.
   */
  public getTestQuestion(subjectid, topicid, testid, testquestionid) {
    return this.api.get(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}/questions/${testquestionid}`);
  }

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


  /**
   * Creates a test question, in a test, in a topic, in a subject, based on values of given question object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param questionObject - values for test question.
   */
  public createTestQuestion(subjectid, topicid, testid, questionObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(questionObject));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}/questions`,
      data
    );
  }


  /**
   * Edits an existing test question, in a test, in a topic, in a subject, based on value of given object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param questionid - id of question.
   * @param questionObject - values for test question.
   */
  public editTestQuestion(subjectid, topicid, testid, questionid, questionObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(questionObject));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}/questions/${questionid}`,
      data
    );
  }
}
