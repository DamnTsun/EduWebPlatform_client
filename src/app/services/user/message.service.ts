import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Message } from 'src/app/classes/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private api: ApiService
  ) { }



  /**
   * Gets messages sent to / from the specified user.
   * @param userid - id of user.
   * @param count - number of messages to get.
   * @param offset - number of messages to skip.
   */
  public getMessagesWithUser(userid, count, offset) {
    return this.api.get(environment.apiUrl +
      `users/chat/${userid}?count=${count}&offset=${offset}`);
  }


  /**
   * Gets messages sent to / from the specified user after the specified timestamp.
   * @param userid - id of user.
   * @param timestamp - timestamp (YYYY-MM-DD HH:MM:SS)
   */
  public getMessagesWithUserAfterTimestamp(userid, timestamp) {
    return this.api.get(environment.apiUrl +
      `users/chat/${userid}?date=${timestamp}`);
  }
  

  /**
   * Sends message to user.
   * @param userid - user that message is being sent to.
   * @param message - message contents.
   */
  public sendMessage(userid, message) {
    let data = new FormData();
    data.set('content', JSON.stringify({ message: message }));
    return this.api.post(
      environment.apiUrl + `users/chat/${userid}`,
      data
    );
  }
  

  /**
   * Deletes a message. (Must be sender or receiver)
   * @param messageid - id of message.
   */
  public deleteUserMessage(messageid) {
    return this.api.delete(environment.apiUrl + `users/messages/${messageid}`);
  }





  /**
   * Groups group messages sent to group.
   * @param groupid - id of group.
   * @param count - number of messages to get.
   * @param offset - number of messages to skip.
   */
  public getGroupMessages(groupid, count, offset): Observable<Message[]> {
    return this.api.get(environment.apiUrl
      + `groups/${groupid}/chat?count=${count}&offset=${offset}`) as Observable<Message[]>;
  }


  /**
   * Gets group messages sent to group after specified timestamp.
   * @param groupid - id of group.
   * @param timestamp - timestamp. (YYYY-MM-DD HH:MM:SS)
   */
  public getGroupMessagesAfterTimestamp(groupid, timestamp): Observable<Message[]> {
    return this.api.get(environment.apiUrl
      + `groups/${groupid}/chat?date=${timestamp}`) as Observable<Message[]>;
  }





  /**
   * Sends a group message to the specified group.
   * @param groupid - id of group.
   * @param message - message being sent.
   */
  public sendGroupMessage(groupid, message) {
    let data = new FormData();
    data.set('content', JSON.stringify({ message: message }));
    return this.api.post(
      environment.apiUrl + `groups/${groupid}/chat`,
      data
    );
  }

  
  /**
   * Deletes a group message.
   * @param groupid - id of group.
   * @param messageid - id of message.
   */
  public deleteGroupMessage(groupid, messageid) {
    return this.api.delete(environment.apiUrl
      + `groups/${groupid}/chat/${messageid}`);
  }
}
