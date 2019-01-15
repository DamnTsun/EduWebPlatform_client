import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { Topic } from 'src/app/classes/Topic';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  constructor(
    private api: ApiService
  ) { }





  // Methods
  /**
   * Gets all topics in subject from api.
   * @param subjectId - id of subject.
   */
  public getTopics(subjectid): Observable<Topic[]> {
    return this.api.get(environment.apiUrl + `subjects/${subjectid}/topics`) as Observable<Topic[]>;
  }
  /**
   * Gets topic with specific subjectid and topicid.
   * @param subjectid - subject id of topic.
   * @param topicid - topicid of topic.
   */
  public getTopic(subjectid, topicid): Observable<Topic[]> {
    return this.api.get(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`) as Observable<Topic[]>;
  }

  
  /**
   * Attempts to create new topic inside given subject.
   * @param subjectid - id of subject.
   * @param topicObject - object representing new topic.
   */
  public createTopic(subjectid, topicObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(topicObject));
    return this.api.post(environment.apiUrl + `subjects/${subjectid}/topics`, data);
  }


  /**
   * Updates existing topic based on given topic object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param topicObject - object containing new values for topic.
   */
  public editTopic(subjectid, topicid, topicObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(topicObject));
    return this.api.post(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`, data);
  }

  /**
   * Deletes a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public deleteTopic(subjectid, topicid) {
    return this.api.delete(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`);
  }
}
