import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  /**
   * Gets route param without the ':' at the start. ':subjectid' => 'subjectid', etc.
   */
  public getRouteParamName(param: string): string {
    if (param.charAt(0) !== ':') { return param; }
    return param.substring(1, param.length);
  }
}
