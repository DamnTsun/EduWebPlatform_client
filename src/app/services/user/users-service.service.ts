import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {

  constructor(
    private api: ApiService
  ) { }



  /**
   * Gets users from api.
   * @param count - number of users to get.
   * @param offset - number of users to skip.
   */
  public getUsers(count, offset) {
    return this.api.get(environment.apiUrl + `users?count=${count}&offset=${offset}`);
  }


  /**
   * Gets users from api whose displayname contains the given value.
   * @param name - value to be searched for.
   * @param count - number of users to get.
   * @param offset - number of users to skip.
   */
  public getUsersByName(name, count, offset) {
    return this.api.get(environment.apiUrl + `users?name=${name}&count=${count}&offset=${offset}`);
  }


  /**
   * Gets messages sent to user.
   * @param count - number of messages to get.
   * @param offset - number of messages to skip.
   */
  public getUserMessages(count, offset) {
    return this.api.get(environment.apiUrl + `users/messages?count=${count}&offset=${offset}`);
  }


  /**
   * Gets messages sent to user by a specific user.
   * @param userid - id of user.
   * @param count - number of messages to get.
   * @param offset - number of messages to skip.
   */
  public getUserMessagesFromUser(userid, count, offset) {
    return this.api.get(environment.apiUrl + `users/messages/${userid}?count=${count}&offset=${offset}`);
  }
}
