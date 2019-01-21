import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from 'src/app/services/user/users-service.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageReceived } from 'src/app/classes/MessageReceived';

@Component({
  selector: 'app-message-from-user-list',
  templateUrl: './message-from-user-list.component.html',
  styleUrls: ['./message-from-user-list.component.css']
})
export class MessageFromUserListComponent implements OnInit {

  // Constants
  private count = 10;
  private offset = 0;

  private senderid = null;                      // Id of message senders.
  private sendername = null;
  private messages$ = [];
  private endOfContent: boolean = false;


  constructor(
    private userService: UsersServiceService,
    private signIn: SignInService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Get params from url.
    this.senderid = this.route.snapshot.paramMap.get(environment.routeParams.userid);


    // Get user sign in status.
    this.signIn.userInternalRecord().subscribe((user) => {
      // If not signed in, redirect to sign in.
      if (user == null) {
        this.router.navigate([ environment.routes.account_signIn ]);
      }
    }, (err) => {
      console.error('MessageFrom-List user record error:', err);
    })


    // Get initial messages.
    this.getMessages();
  }


  /**
   * Scroll event for infinite scroll.
   */
  private onScroll() {
    if (!this.endOfContent) {
      this.getMessages();
    }
  }


  /**
   * Attempt to get messages from specified user from api.
   */
  private getMessages() {
    this.userService.getUserMessagesFromUser(this.senderid, this.count, this.offset)
      .subscribe((messages: MessageReceived[]) => {
        // See if any messages fetched.
        if (messages.length > 0) {
          this.messages$ = this.messages$.concat(messages);
          this.offset += messages.length;
          // If less records retreived than asked for, must be end of messages.
          if (messages.length < this.count) {
            this.endOfContent = true;
          }
          // If sender name not set, set it.
          if (this.sendername == null) {
            this.sendername = `${messages[0].sender_displayname} (#${messages[0].sender_id})`;
          }
        } else {
          // Empty list fetched. Must be end of messages.
          this.endOfContent = true;
        }
    })
  }



  /**
   * Deletes message from api with given index.
   * @param index - index of message.
   */
  private deleteMessage(index) {
    // Check index valid.
    if (index < 0 || index >= this.messages$.length) { return; }
    // Get confirmation from user.
    if (!confirm('Are you sure you want to delete the message?')) { return; }

    // Attempt delete.
    this.userService.deleteUserMessage(this.messages$[index].id).subscribe((res) => {
      // Successful. Remove from list.
      this.messages$ = this.messages$.filter((m, i, a) => {
        return i !== index;
      })
    })
  }
}
