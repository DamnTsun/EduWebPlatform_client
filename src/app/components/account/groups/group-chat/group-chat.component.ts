import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from 'src/app/classes/Message';
import { SignInService } from 'src/app/services/sign-in.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/services/user/message.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit, OnDestroy {

  // ID of current user / the group.
  private userid = null;
  private groupid = null;

  // Message list and related values.
  private messages$: Message[] = [];
  private count = 25;
  private offset = 0;
  private endOfContent: boolean = false;
  private newMessageCheckInterval = 10; // Number of seconds between checking for new messages.
  private newMessageCheckHandle = null; // Reference to interval so that it may be cancelled.

  // Error message for display if something goes wrong.
  private errorMessage: string = null;





  constructor(
    private signIn: SignInService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService
  ) { }

  ngOnInit() {
    // Get route params.
    this.groupid = this.route.snapshot.paramMap.get(environment.routeParams.groupid);


    // Check user is signed in.
    this.signIn.userInternalRecord().subscribe((user) => {
      // Redirect to sign in if not signed in.
      if (user == null) {
        this.router.navigate([environment.routes.account_signIn]);
        return;
      }
      this.userid = user[0].id;
    }, (err) => {
      console.error('Group chat user record error:', err);
    });


    // Get initial messages.
    this.getMessages();


    // Set interval to check for new messages.
    this.newMessageCheckHandle = setInterval(this.getNewerMessages, this.newMessageCheckInterval * 1000);


    // Add event listener for message input.
    document.getElementById('messageInput').addEventListener('input', (e) => {
      let input = (<HTMLInputElement>e.target);
      let len = input.value.length;
      if (len < 1) {
        (<HTMLButtonElement>document.getElementById('messageSubmit')).disabled = true;
        return;
      }
      if (len > 1024) {
        (<HTMLButtonElement>document.getElementById('messageSubmit')).disabled = true;
        return;
      }
      // Validation passed. Enable button.
      (<HTMLButtonElement>document.getElementById('messageSubmit')).disabled = false;
    });
    // Add event listen to message input for key up. Submit when 'enter' pressed.
    document.getElementById('messageInput').addEventListener('keyup', (e) => {
      // If enter pressed.
      if (e.key === 'Enter') {
        // If submit button not disabled.
        if (!(<HTMLButtonElement>document.getElementById('messageSubmit')).disabled) {
          this.sendMessage();
        }
      }
      e.preventDefault();
    });
  }


  ngOnDestroy(): void {
    // Clear new message check interval.
    clearInterval(this.newMessageCheckHandle);
  }



  /**
   * Scroll event for infinite scroll.
   */
  public onScroll(): void {
    if (!this.endOfContent) {
      this.getMessages();
    }
  }


  /**
   * Attempts to get more messages from api.
   */
  private getMessages(): void {
    this.messageService.getGroupMessages(this.groupid, this.count, this.offset).subscribe((messages: Message[]) => {
      // Check if any messages received.
      if (messages.length > 0) {
        this.messages$ = this.messages$.concat(messages);
        this.offset += messages.length;
        // If less messages received than asked for, must be end of messages.
        if (messages.length < this.count) {
          this.endOfContent = true;
        }
      } else {
        // No messages received. Must be end of messages.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Group Chat get current messages Error:', err);
    });
  }



  /**
   * Gets newer messages. (Messages sent AFTER current time - interval).
   */
  private getNewerMessages = () => {
    // Get formatted timestamp for current time - interval time.
    let timestamp = this.util.getIsoTimeFormatted(new Date(new Date().getTime() - this.newMessageCheckInterval * 1000));

    // Get any new messages.
    this.messageService.getMessagesWithUserAfterTimestamp(this.groupid, timestamp).subscribe((messages: Message[]) => {
      // If any new messages received.
      if (messages.length > 0) {
        // Remove messages in current list that were sent after timestamp.
        // Messages sent by current user are shown immediately.
        this.messages$ = this.messages$.filter(msg => new Date(timestamp) > new Date(msg.date));
        // Add new messages to start.
        this.messages$.unshift.apply(this.messages$, messages);
      }
    }, (err) => {
      console.error('Group Chat get new messages Error:', err);
    });
  }



  /**
   * Sends a new message from the current user to the group.
   */
  public sendMessage() {
    let input = <HTMLInputElement>document.getElementById('messageInput');
    let msg = input.value;
    // Ensure valid.
    if (msg == null || msg.length < 1 || msg.length > 1024) {
      return;
    }

    // Send the message.
    this.messageService.sendGroupMessage(this.groupid, msg).subscribe((res) => {
      // Add message to front of messages list.
      this.messages$.unshift(res[0]);
      // Clear message input.
      input.value = '';
      (<HTMLButtonElement>document.getElementById('messageSubmit')).disabled = true;
    }, (err) => {
      console.error('Group Chat send message Error:', err);
    });
  }



  /**
   * Deletes message the current user has sent.
   * @param index - index of message in list.
   */
  public deleteMessage(index) {
    // Check index valid.
    if (index < 0 || index>= this.messages$.length) { return; }
    // Attempt delete.
    this.messageService.deleteGroupMessage(this.groupid, this.messages$[index].id).subscribe(res => {
      // Success. Remove from list.
      this.messages$ = this.messages$.filter((ele, i) => { return i !== index; });
    });
  }





  // HTML Methods
  /**
   * Whether the user displayname of a message should be shown.
   * Makes it so that the name is only shown at the top of a group of messages from a particular user.
   * @param index 
   */
  public shouldShowNameOnMessage(index) {
    // If invalid index, don't show name.
    if (index < 0 || index >= this.messages$.length) { return false; }
    // If top message, show name.
    if (index == 0) { return true; }
    // If sender of this message is different from previous message, show their name.
    return (this.messages$[index].sender_id !== this.messages$[index - 1].sender_id);
  }
}
