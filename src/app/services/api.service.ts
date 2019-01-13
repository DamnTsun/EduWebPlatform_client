import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

import { Subject } from '../classes/Subject';
import { Topic } from '../classes/Topic';
import { Post } from '../classes/Posts';
import { Lesson } from '../classes/Lesson';
import { Test } from '../classes/Test';
import { AuthObject } from '../classes/AuthObject';
import { TestQuestion } from '../classes/TestQuestion';
import { UserTest } from '../classes/UserTest';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Holds authorization data, such as the JWT for when making requests.
  private authObject: AuthObject = null;





  constructor(private http: HttpClient) { }





  // *** HEADER INJECTION ***
  // Injects JWT as header 'HTTP_IDTOKEN' if user is signed in.
  /**
   * Adds HTTP_IDTOKEN header if auth object is set.
   * @param headers 
   */
  private createAuthorizationHeader() {
    let headers = new HttpHeaders();
    if (this.authObject !== null) {
      headers = headers.set('idToken', this.authObject.idToken);
    }
    return headers;
  }

  /**
   * Performs get request. Automatically injects authentification header if possible.
   * @param url - url of request.
   */
  public get(url) {
    let headers = this.createAuthorizationHeader();
    return this.http.get(url, {
      headers: headers
    });
  }
  /**
   * Performs post request. Automatically injects authentification header if possible.
   * @param url - url of request.
   * @param body - body of request.
   */
  public post(url, body) {
    let headers = this.createAuthorizationHeader();
    return this.http.post(url, body, {
      headers: headers
    });
  }
  /**
   * Performs delete request. Automatically injects authentification header if possible.
   * @param url - url of request.
   */
  public delete(url) {
    let headers = this.createAuthorizationHeader();
    return this.http.delete(url, {
      headers: headers
    });
  }





  // *** AUTHORIZING WITH BACKEND ***
  /**
   * Sets authorization object. Contains JWT for request headers.
   * @param authObject - Authorization object.
   */
  public setAuthObject(authObject: AuthObject): void {
    this.authObject = authObject;
    console.log(this.authObject);
  }
  /**
   * Clears authorization object.
   */
  public clearAuthObject(): void {
    this.authObject = null;
  }











  /**
   * Authorizes with backend api using Google id_token.
   * @param google_id_token - id_token from Google for signed in user.
   */
  public authorizeWithBackendGoogle(google_id_token: string): Observable<AuthObject> {
    // Build form data. (Backend uses x-www-form-urlencoded)
    let data = new FormData();
    data.set('google_id_token', google_id_token);
    return this.post(environment.apiUrl +
      `users/auth/google`, data) as Observable<AuthObject>;
  }
  /**
   * Authorizes with backend api using Facebook auth_token.
   * @param google_id_token - id_token from Google for signed in user.
   */
  public authorizeWithBackendFacebook(facebook_auth_token: string): Observable<AuthObject> {
    // Build form data. (Backend uses x-www-form-urlencoded)
    let data = new FormData();
    data.set('facebook_id_token', facebook_auth_token);
    return this.post(environment.apiUrl +
      `users/auth/facebook`, data) as Observable<AuthObject>;
  }
  // *** END OF AUTHORIZATION ***

}
