import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private api: ApiService
  ) { }



  /**
   * Gets groups from api. Only gets groups that the current user is a member of.
   */
  public getGroups(count, offset) {
    return this.api.get(environment.apiUrl
      + `groups?count=${count}&offset=${offset}`);
  }


  /**
   * Admin only version of getGroups. Returns all groups, regardless of if current user is an admin.
   * @param count - number of groups to get.
   * @param offset - number of groups to skip.
   */
  public getAllGroups(count, offset) {
    
  }
}
