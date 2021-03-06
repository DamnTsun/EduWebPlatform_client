import { Component, OnInit, OnDestroy } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { MessageService } from 'src/app/services/user/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Message } from 'src/app/classes/Message';
import { UtilService } from 'src/app/services/util.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  public userid = null;
  public otherUserId = null;
  public submitDisabled = true;
  public errorMessage: string = null;

  public messages$: Message[] = [];

  public endOfContent: boolean = false;
  private count = 25;
  private offset = 0;
  private newMessageCheckInterval = 10; // Number of seconds between checking for new messages.
  private newMessageCheckHandle = null; // Hold reference to interval so that it can be stopped when leaving.


  constructor(
    private signIn: SignInService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    public navService: NavigationServiceService,
    private util: UtilService
  ) { }

  ngOnInit() {
    // Get route params.
    this.otherUserId = this.route.snapshot.paramMap.get(environment.routeParams.userid);


    // Check user is signed in.
    this.signIn.userInternalRecord().subscribe((user) => {
      // Redirect to sign in if not signed in.
      if (user == null) {
        this.router.navigate([ environment.routes.account_signIn ]);
        return;
      }
      this.userid = user[0].id;
    }, (err) => {
      console.error('Chat user record error:', err);
    })


    // Get initial messages.
    this.getMessages();


    // Set interval to check for new messages. (to be added to TOP of message list)
    this.newMessageCheckHandle = setInterval(this.getNewerMessages, this.newMessageCheckInterval * 1000);


    // Add event listener for message input.
    document.getElementById('messageInput').addEventListener('input', (e) => {
      let input = (<HTMLInputElement>e.target);
      let len = input.value.trim().length;
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
    this.messageService.getMessagesWithUser(this.otherUserId, this.count, this.offset).subscribe((messages: Message[]) => {
      // Check if any messages fetched.
      if (messages.length > 0) {
        this.messages$ = this.messages$.concat(messages);
        this.offset += messages.length;
        // If less messages received than asked for, must be end of messages.
        if (messages.length < this.count) {
          this.endOfContent = true;
        }
      } else {
        // Empty list. End of messages.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Chat get current messages Error:', err);
    });
  }


  /**
   * Gets newer messages. (Messages sent AFTER current timestamp - interval time)
   */
  private getNewerMessages = () => {
    // Get formatted timestamp for current time - interval time.
    let timestamp = this.util.getIsoTimeFormatted(new Date(new Date().getTime() - this.newMessageCheckInterval * 1000));

    // Get any new messages.
    this.messageService.getMessagesWithUserAfterTimestamp(this.otherUserId, timestamp).subscribe((messages: Message[]) => {
      // If any new messages received.
      if (messages.length > 0) {
        /* Remove any messages from current list that were added after timestamp.
            (When current user sends a message it is added automatically, however getting new messages will also return them.) */
        this.messages$ = this.messages$.filter(msg => new Date(timestamp) > new Date(msg.date));
        // Add new messages to start of message list.
        this.messages$.unshift.apply(this.messages$, messages);
      }
    }, (err) => {
      console.error('Chat get new messages Error:', err);
    });
  }



  /**
   * Validates input and sends message to other user if valid.
   * Automatically adds new message to front of chat if successful.
   */
  public sendMessage() {
    let input = <HTMLInputElement>document.getElementById('messageInput');
    let msg = input.value.trim();
    // Ensure valid.
    if (msg == null || msg.length < 1 || msg.length > 1024) {
      this.errorMessage = 'Message must be between 1 and 1024 characters long and cannot be blank.';
      return;
    }
    // Clear error message if input is now valid.
    this.errorMessage = null;

    // Send the message.
    this.messageService.sendMessage(this.otherUserId, msg).subscribe((res) => {
      // Add newly create message to front of chat.
      this.messages$.unshift(res[0]);
      // Reset input.
      input.value = '';
      (<HTMLButtonElement>document.getElementById('messageSubmit')).disabled = true;
    }, (err) => {
      console.error('Chat send message error:', err);
    });
  }



  /**
   * Deletes a message the current user has sent.
   * @param index - index of message in list.
   */
  public deleteMessage(index) {
    // Check index valid.
    if (index < 0 || index >= this.messages$.length) { return; }
    // Attempt delete.
    this.messageService.deleteUserMessage(this.messages$[index].id).subscribe((res) => {
      // Successful. Remove from list.
      this.messages$ = this.messages$.filter((ele, i) => { return i !== index; });
    })
  }






  // Methods for HTML
  /**
   * Whether the user displaynmae of a message should be shown.
   * Makes it so that the displayname is only shown at the top of a group of messages by a user.
   * @param index - index of message in array.
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

