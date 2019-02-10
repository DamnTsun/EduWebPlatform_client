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


  /**
   * Get ISO time for given timestamp and converts it to format that api accepts (yyyy-mm-dd hh:mm:ss).
   * @param date - timestamp.
   */
  public getIsoTimeFormatted(date: Date) {
    // JS method gives format yyyy-mm-ddThh:mm:ss.xxxZ
    // Split on 'T'
    let isoTimeFrags = date.toISOString().split('T');
    // Split 2nd frag on '.'.
    let time = isoTimeFrags[1].split('.')[0];
    return `${isoTimeFrags[0]} ${time}`;
  }
}
