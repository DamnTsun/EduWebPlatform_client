import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Test } from 'src/app/classes/Test';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TestsService {

  constructor(
    private api: ApiService
  ) { }





  /**
   * Gets all tests in topic from api.
   * @param subjectid - id of subject topic is in.
   * @param topicid - id of topic.
   */
  public getTests(subjectid, topicid, count, offset): Observable<Test[]> {
    return this.api.get(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests?count=${count}&offset=${offset}`) as Observable<Test[]>;
  }
  /**
   * Gets test in specified topic, in specified subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public getTest(subjectid, topicid, testid): Observable<Test[]> {
    return this.api.get(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}`) as Observable<Test[]>
  }


  /**
   * Creates a new test, in the given topic, in the given subject, based on values in given test object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testObject - object containing values for new test.
   */
  public createTest(subjectid, topicid, testObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(testObject));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests`,
      data
    );
  }


  /**
   * Edit an existing test, in given topic, in given subject, based on values in given object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param testObject - object containing values for test.
   */
  public editTest(subjectid, topicid, testid, testObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(testObject));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}`,
      data
    );
  }

  
  /**
   * Deletes a test, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public deleteTest(subjectid, topicid, testid) {
    return this.api.delete(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/tests/${testid}`);
  }
}
