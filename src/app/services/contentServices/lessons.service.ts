import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { Lesson } from 'src/app/classes/Lesson';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(
    private api: ApiService
  ) { }





  /**
   * Gets all lessons inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getLessons(subjectid, topicid): Observable<Lesson[]> {
    return this.api.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/lessons`) as Observable<Lesson[]>;
  }



  /**
   * Geta lesson by id, inside a topic, inside a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonid id of lesson.
   */
  public getLesson(subjectid, topicid, lessonid): Observable<Lesson[]> {
    return this.api.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}
        /lessons/${lessonid}`
    ) as Observable<Lesson[]>;
  }


  
  /**
   * Deletes a lesson, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonid - id of lesson.
   */
  public deleteLesson(subjectid, topicid, lessonid) {
    return this.api.delete(environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/lessons/${lessonid}`);
  }
}
