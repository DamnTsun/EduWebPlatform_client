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
