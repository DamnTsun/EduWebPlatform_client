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
   * Deletes a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public deleteTopic(subjectid, topicid) {
    return this.api.delete(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}`);
  }
}
