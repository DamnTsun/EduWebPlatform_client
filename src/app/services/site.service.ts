import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';
import { Post } from '../classes/Posts';
import { Lesson } from '../classes/Lesson';
import { Test } from '../classes/Test';
import { SignInService } from './sign-in.service';
import { TestQuestion } from '../classes/TestQuestion';
import { UserTest } from '../classes/UserTest';


/**
 * Site services.
 * Handles keeping track of things such as subjectId, topicId, etc.
 * Calls api service using stored ids to get corresponding records from api.
 */
@Injectable({
  providedIn: 'root'
})
export class SiteService {



  /**
   * Constructor.
   */
  constructor(
    private router: Router,
    private api: ApiService,
    private signIn: SignInService
  ) { }


  // TOPICS
  /**
   * Gets all topics in subject from api.
   * @param subjectId - id of subject.
   */
  public getTopics(subjectId): Observable<Topic[]> {
    //if (this.subjectRecord == null) { return null; }
    return this.api.getTopics(subjectId);
  }
  /**
   * Gets topic with specific subjectid and topicid.
   * @param subjectid - subject id of topic.
   * @param topicid - topicid of topic.
   */
  public getTopic(subjectid, topicid): Observable<Topic[]> {
    return this.api.getTopic(subjectid, topicid);
  }

  /**
   * Deletes a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public deleteTopic(subjectid, topicid) {
    return this.api.deleteTopic(subjectid, topicid);
  }


  // LESSONS
  /**
   * Gets all lesson in topic from api.
   * @param subjectid - id of subject topic is in.
   * @param topicid - id of topic.
   */
  public getLessons(subjectid, topicid): Observable<Lesson[]> {
    return this.api.getLessons(subjectid, topicid);
  }
  /**
   * Gets lesson in specified topic, in specified subject.
   * @param subjectid - id of subject
   * @param topicid - id of topic
   * @param lessonid - id of lesson
   */
  public getLesson(subjectid, topicid, lessonid): Observable<Lesson[]> {
    return this.api.getLesson(subjectid, topicid, lessonid);
  }

  /**
   * Deletes a lesson, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonid - id of lesson.
   */
  public deleteLesson(subjectid, topicid, lessonid) {
    return this.api.deleteLesson(subjectid, topicid, lessonid);
  }



  // TESTS
  /**
   * Gets all tests in topic from api.
   * @param subjectid - id of subject topic is in.
   * @param topicid - id of topic.
   */
  public getTests(subjectid, topicid): Observable<Test[]> {
    return this.api.getTests(subjectid, topicid);
  }
  /**
   * Gets test in specified topic, in specified subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public getTest(subjectid, topicid, testid): Observable<Test[]> {
    return this.api.getTest(subjectid, topicid, testid);
  }

  /**
   * Deletes a test, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public deleteTest(subjectid, topicid, testid) {
    return this.api.deleteTest(subjectid, topicid, testid);
  }



  // USER TESTS
  /**
   * Gets specified number of questions in a test, in a topic, in a subject.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param count - number of questions.
   */
  public getUserTestQuestions(subjectid, topicid, testid, count): Observable<TestQuestion[]> {
    return this.api.getUserTestQuestions(subjectid, topicid, testid, count);
  }
  /**
   * Sends a user_test object to the API so that it can be saved.
   * @param user_test - user_test object.
   */
  public addUserTest(user_test): Observable<UserTest[]> {
    return this.api.addUserTest(user_test);
  }




  // Utility
  public redirect(route: string): void {
    this.router.navigate([route]);
  }
}
