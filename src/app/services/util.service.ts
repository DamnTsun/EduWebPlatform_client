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

}
