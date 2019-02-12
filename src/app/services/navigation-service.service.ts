import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NavigationServiceService {

  constructor(

  ) { }


  // SUBJECTS
  // Get route methods. Auto replaces param names with given values (where appropriate).
  /**
   * Gets subject list route.
   */
  public getSubjectListRoute(): string {
    return `/${environment.routes.subjectSelect}`;
  }

  /**
   * Gets subject home route.
   * @param subjectid - id of subject.
   */
  public getSubjectHomeRoute(subjectid): string {
    let route = `/${environment.routes.subjectHome}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    return route;
  }



  // TOPICS
  /**
   * Gets topic list route.
   * @param subjectid - id of subject.
   */
  public getTopicListRoute(subjectid): string {
    let route = `/${environment.routes.topicSelect}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    return route;
  }

  /**
   * Gets topic home route.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getTopicHomeRoute(subjectid, topicid): string {
    let route = `/${environment.routes.topicHome}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, topicid);
    return route;
  }



  // LESSONS
  /**
   * Gets lesson list route.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getLessonListRoute(subjectid, topicid): string {
    let route = `/${environment.routes.lessonList}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, topicid);
    return route;
  }

  /**
   * Gets lesson home route.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param lessonid - id of lesson.
   */
  public getLessonHomeRoute(subjectid, topicid, lessonid) {
    let route = `/${environment.routes.lessonHome}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, topicid);
    route = route.replace(`:${environment.routeParams.testid}`, lessonid);
    return route;
  }



  // TESTS
  /**
   * Gets test list route.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   */
  public getTestListRoute(subjectid, topicid): string {
    let route = `/${environment.routes.testList}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, topicid);
    return route;
  }

  /**
   * Gets test home route.
   * @param subjectid - id of subject.
   * @param topicid - id of topic.
   * @param testid - id of test.
   */
  public getTestHomeRoute(subjectid, topicid, testid): string {
    let route = `/${environment.routes.testHome}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, topicid);
    route = route.replace(`:${environment.routeParams.testid}`, testid);
    return route;
  }


  // USER TESTS
  /**
   * Gets user test details route.
   * @param subjectid - id of sujbect.
   * @param topicid - id of topic.
   * @param testid - id of test.
   * @param utestid - id of user test.
   */
  public getUserTestDetailsRoute(subjectid, topicid, testid, utestid) {
    let route = `/${environment.routes.userTestDetails}`;
    route = route.replace(`:${environment.routeParams.subjectid}`, subjectid);
    route = route.replace(`:${environment.routeParams.topicid}`, topicid);
    route = route.replace(`:${environment.routeParams.testid}`, testid);
    route = route.replace(`:${environment.routeParams.usertestid}`, utestid);
    return route;
  }



  


  // USERS
  public getUserListRoute(): string {
    return `/${environment.routes.usersList}`;
  }
}
