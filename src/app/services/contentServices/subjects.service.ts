import { Injectable } from '@angular/core';
import { Subject } from 'src/app/classes/Subject';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { Post } from 'src/app/classes/Posts';
import { environment } from 'src/environments/environment';
import { SubjectAdmin } from 'src/app/classes/SubjectAdmin';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  /***** VARIABLES *****/
  // Subject record observable. Component may subscribe to this to have the value pushed to them when it updates.
  // Stored as subject record is used in multiple places, not just 1 place at a time. Such as navigation bar.
  private subjectRecord: BehaviorSubject<Subject> = new BehaviorSubject(null);
  public subject(): Observable<Subject> { return this.subjectRecord.asObservable(); }





  constructor(
    private api: ApiService
  ) { }





  // Methods.
  /**
   * Sets the subject in use. Gets and stores subject with specified id.
   * @param subjectId - id of subject.
   */
  public setSubject(subjectid): void {
    this.api.get(environment.apiUrl + `subjects/${subjectid}`).subscribe((subjects) => {
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
  }





  /**
   * Gets all subjects from api.
   */
  public getSubjects(count, offset) {
    return this.api.get(environment.apiUrl + `subjects?count=${count}&offset=${offset}`) as Observable<Subject[]>;
  }


  /**
   * Attempts to create new subject on API based on given object.
   * @param subjectObject - object representing subject.
   */
  public createSubject(subjectObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(subjectObject));
    return this.api.post(environment.apiUrl + `subjects`, data) as Observable<Subject[]>;
  }

  /**
   * Attempts to edit an existing subject on API based on given object.
   * @param subjectObject - object representing new subject values.
   */
  public editSubject(subjectid, subjectObject) {
    let data = new FormData();
    data.set('content', JSON.stringify(subjectObject));
    return this.api.post(environment.apiUrl + `subjects/${subjectid}`, data) as Observable<Subject[]>;
  }

  /**
   * Deletes a subject.
   * @param subjectid - id of subject.
   */
  public deleteSubject(subjectid) {
    return this.api.delete(environment.apiUrl + `subjects/${subjectid}`) as Observable<Subject[]>;
  }



  // SUBJECT POSTS
  /**
   * Gets all news posts in subject.
   * @param subjectId - id of subject.
   * @param count - number of posts to get.
   * @param offset - number of posts to skip.
   */
  public getPosts(subjectId, count, offset): Observable<Post[]> {
    return this.api.get(environment.apiUrl +
      `subjects/${subjectId}/posts?count=${count}&offset=${offset}`) as Observable<Post[]>;
  }

  /**
   * Gets a specified news post inside a subject.
   * @param subjectid - id of subject.
   * @param postid - id of post.
   */
  public getPost(subjectid, postid): Observable<Post[]> {
    return this.api.get(environment.apiUrl
        + `subjects/${subjectid}/posts/${postid}`) as Observable<Post[]>;
  }


  /**
   * Creates a new post, associated with the specified subject, on the api.
   * @param subjectid - id of subject.
   * @param post - data for post.
   */
  public createPost(subjectid, post) {
    // CURRENTLY UNTESTS / NOT USED ANYWHERE
    let data = new FormData();
    data.set('content', JSON.stringify(post));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/posts`,
      data
    );
  }

  /**
   * Updates values of existing subject post based on given object.
   * @param subjectid - id of subject.
   * @param postid - id of post.
   * @param post - new values for post.
   */
  public editPost(subjectid, postid, post) {
    let data = new FormData();
    data.set('content', JSON.stringify(post));
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/posts/${postid}`,
      data
    );
  }


  /**
   * Deletes specified post from api.
   * @param subjectid - id of subject.
   * @param postid - id of post.
   */
  public deletePost(subjectid, postid) {
    return this.api.delete(environment.apiUrl +
        `subjects/${subjectid}/posts/${postid}`);
  }




  // SUBJECT ADMINS
  /**
   * Gets subject admins associated with the specified subject.
   * @param subjectid - id of subject.
   * @param count - number of records to get.
   * @param offset - number of records to skip.
   */
  public getSubjectAdmins(subjectid, count, offset): Observable<SubjectAdmin[]> {
    return this.api.get(
      environment.apiUrl + `subjects/${subjectid}/admins`
    ) as Observable<SubjectAdmin[]>;
  }

  /**
   * Gets whether the current user is a subject admin for the specified subject.
   * @param subjectid - id of subject.
   */
  public getCurrentUserSubjectAdminStatus(subjectid) {
    return this.api.get(
      environment.apiUrl + `subjects/${subjectid}/admins/me`
    );
  }

  /**
   * Adds the current user as a subject admin for the specified subject.
   * Will only be successful if:
   * - The current user is an admin.
   * - The current user is not already a subject admin for the specified subject.
   * @param subjectid - id of subject.
   */
  public addMyselfAsSubjectAdmin(subjectid): Observable<SubjectAdmin[]> {
    return this.api.post(
      environment.apiUrl + `subjects/${subjectid}/admins`,
      new FormData()
    ) as Observable<SubjectAdmin[]>;
  }


  /**
   * Removes the current user as a subject admin for the specified subject.
   * Will only be successful if both:
   * - The current user is an admin.
   * - The current user is already a subject admin for the specified subject.
   * @param subjectid 
   */
  public removeMyselfAsSubjectAdmin(subjectid) {
    return this.api.delete(environment.apiUrl + `subjects/${subjectid}/admins`);
  }
}
