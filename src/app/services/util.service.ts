import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthObject } from '../classes/AuthObject';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private http: Http
  ) { }

  /**
   * Gets route param without the ':' at the start. ':subjectid' => 'subjectid', etc.
   */
  public getRouteParamName(param: string): string {
    if (param.charAt(0) !== ':') { return param; }
    return param.substring(1, param.length);
  }


  // Does authorizations with backend because for *some* reason it causes an error in the signin service...
  public authorizeWithBackendGoogle(google_id_token: string): Observable<AuthObject> {
    let data = new FormData();
    data.set('google_id_token', google_id_token);
    return (this.http.post(environment.apiUrl +
      `users/auth/google`, data) as Observable<unknown>) as Observable<AuthObject>;
  }
}
