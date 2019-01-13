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

  /***** VARIABLES *****/
  // Subject record observable. Component may subscribe to this to have the value pushed to them when it updates.
  // Stored as subject record is used in multiple places, not just 1 place at a time. Such as navigation bar.
  private subjectRecord: BehaviorSubject<Subject> = new BehaviorSubject(null);
  public subject(): Observable<Subject> { return this.subjectRecord.asObservable(); }





  /**
   * Constructor.
   */
  constructor(
    private router: Router,
    private api: ApiService,
    private signIn: SignInService
  ) { }





  /***** METHODS *****/
  // SET / CLEAR SUBJECT
  /**
   * Sets the subject in use. Gets and stores subject with specified id.
   * @param subjectId - id of subject.
   */
  public setSubject(subjectId): void {
    this.api.getSubject(subjectId).subscribe((subjects) => {
      this.subjectRecord.next(subjects[0]);
    }, (err) => {
      console.error('SiteService - Subject: ', err);
      this.subjectRecord.next(null);
    });
  }

  /**
   * Clears the currently selected subject by setting it to null.
   */
  public clearSubject(): void {
    this.subjectRecord.next(null);
    //this.clearTopic();
    //this.clearLesson();
    //this.clearTest();
  }





  // *** GENERAL CONTENT RELATED ***
  // SUBJECTS
  /**
   * Gets all subjects from api.
   */
  public getSubjects() {
    return this.api.getSubjects();
  }

  /**
   * Deletes a subject.
   * @param subjectid - id of subject.
   */
  public deleteSubject(subjectid) {
    return this.api.deleteSubject(subjectid);
  }



  // SUBJECT POSTS
  /**
   * Gets all posts in subject from api.
   */
  public getPosts(subjectId, count, offset): Observable<Post[]> {
    return this.api.getPosts(subjectId, count, offset);
  }



  // TOPICS
  /**
   * Gets all topics in subject from api.
   * @param subjectId - id of subject.
   */
  public getTopics(subjectId): Observable<Topic[]> {
    if (this.subjectRecord == null) { return null; }
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
