import { Component, OnInit } from '@angular/core';
import { UsersServiceService } from 'src/app/services/user/users-service.service';
import { SignInService } from 'src/app/services/sign-in.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  // Constants
  private count = 10;
  private offset = 0;

  private messages$ = [];
  private endOfContent: boolean = false;


  constructor(
    private userService: UsersServiceService,
    private signIn: SignInService,
    private router: Router
  ) { }

  ngOnInit() {
    // Get user sign in status.
    this.signIn.userInternalRecord().subscribe((user) => {
      // If not signed in, redirect to sign in.
      if (user == null) {
        this.router.navigate([ environment.routes.account_signIn ]);
      }
    }, (err) => {
      console.error('Message-List user record error:', err);
    });


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
   * Attempts to get messages from api.
   */
  private getMessages() {
    this.userService.getUserMessages(this.count, this.offset).subscribe((messages: object[]) => {
      if (messages.length > 0) {
        this.messages$ = this.messages$.concat(messages);
        this.offset += messages.length;
        // If less records retreived than asked for, must be end of messages.
        if (messages.length < this.count) {
          this.endOfContent = true;
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
