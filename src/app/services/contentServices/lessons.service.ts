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
  public getLessons(subjectid, topicid, count, offset): Observable<Lesson[]> {
    return this.api.get(environment.apiUrl +
      `subjects/${subjectid}/topics/${topicid}/lessons?count=${count}&offset=${offset}`) as Observable<Lesson[]>;
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
   * Creates new lesson, in the specified topic, in the specified subject, based on given lesson object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonObject - object containing values for lesson.
   */
  public createLesson(subjectid, topicid, lessonObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(lessonObject));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/lessons`,
      data
    );
  }


  /**
   * Edits an existing lesson, in the specified topic, in the specified subject, based on given lesson object.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonid - id of lesson.
   * @param lessonObject - object containing values for lesson.
   */
  public editLesson(subjectid, topicid, lessonid, lessonObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(lessonObject));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/topics/${topicid}/lessons/${lessonid}`,
      data
    );
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
