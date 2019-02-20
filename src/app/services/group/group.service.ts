import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Group } from 'src/app/classes/Group';
import { notImplemented } from '@angular/core/src/render3/util';

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
  public getGroups(count, offset): Observable<Group[]> {
    return this.api.get(environment.apiUrl
      + `groups?count=${count}&offset=${offset}`) as Observable<Group[]>;
  }


  /**
   * Admin only version of getGroups. Returns all groups, regardless of if current user is an admin.
   * @param count - number of groups to get.
   * @param offset - number of groups to skip.
   */
  public getAllGroups(count, offset) {
    
  }



  /**
   * Gets group by id.
   * API-side: Current user must be in group, or admin, to successfully get group.
   * @param groupid - id of group.
   */
  public getGroup(groupid): Observable<Group[]> {
    return this.api.get(environment.apiUrl
      + `groups/${groupid}`) as Observable<Group[]>;
  }








  /**
   * Gets users who are a member of the specified group.
   * @param groupid - id of group.
   * @param count - number of users to get.
   * @param offset - number of users to skip.
   */
  public getGroupMembers(groupid, count, offset) {
    return this.api.get(environment.apiUrl
      + `groups/${groupid}/members?count=${count}&offset=${offset}`);
  }

  /**
   * Gets users who are not a member of the specified group.
   * @param groupid - id of group.
   * @param count - number of users to get.
   * @param offset - number of users to skip.
   */
  public getGroupNonMembers(groupid, count, offset) {
    return this.api.get(environment.apiUrl
      + `groups/${groupid}/nonmembers?count=${count}&offset=${offset}`);
  }


  /**
   * Adds specified user to specified group.
   * @param groupid - id of group.
   * @param userid - id of user.
   */
  public addMemberToGroup(groupid, userid) {
    return this.api.post(environment.apiUrl
      + `groups/${groupid}/members/${userid}`,
      new FormData()
    );
  }

  /**
   * Removes specified user from specified group.
   * @param groupid - id of group.
   * @param userid - id of user.
   */
  public removeMemberFromGroup(groupid, userid) {
    return this.api.delete(environment.apiUrl
      + `groups/${groupid}/members/${userid}`);
  }





  /**
   * Creates new group on api based on given values of object.
   * @param group - object containing values for group.
   */
  public createGroup(group) {
    let data = new FormData();
    data.set('content', JSON.stringify(group));
    return this.api.post(
      environment.apiUrl + `groups`,
      data
    );
  }


  /**
   * Deletes specified group.
   * @param groupid - id of group.
   */
  public deleteGroup(groupid) {
    // not implemented...
  }
}
