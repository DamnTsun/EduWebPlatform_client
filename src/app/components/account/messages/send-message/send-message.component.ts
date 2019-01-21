import { Component, OnInit } from '@angular/core';
import { SignInService } from 'src/app/services/sign-in.service';
import { UsersServiceService } from 'src/app/services/user/users-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {

  private receiverid = null;
  private submitted: boolean = false;
  private errorMessage: string = null;


  constructor(
    private signIn: SignInService,
    private userService: UsersServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Get route params.
    this.receiverid = this.route.snapshot.paramMap.get(environment.routeParams.userid);


    // Get user sign in status.
    this.signIn.userInternalRecord().subscribe((user) => {
      if (user == null) {
        this.router.navigate([environment.routes.account_signIn]);
      }
    });
  }



  /**
   * Validate and send message.
   */
  private sendMessage() {
    // Get message input.
    let message = <HTMLTextAreaElement>document.getElementById('message');
    if (message.value.trim() == '') {
      this.errorMessage = 'Message must not be blank.'
      return;
    }
    if (message.value.trim().length > 1024) {
      this.errorMessage = 'Message must be 1024 characters or less in length.'
      return;
    }

    // Clear error message.
    this.errorMessage = null;
    // Attempt to send message if able.
    if (!this.submitted) {
      this.submitted = true;
      this.userService.sendMessage(this.receiverid, message.value.trim()).subscribe((res) => {
        // Successful. Redirect to sent messages area.
        let route = environment.routes.messageSentToList;
        route = route.replace(`:${environment.routeParams.userid}`, this.receiverid);
        this.router.navigate([route]);
      }, (err) => {
        this.submitted = false;
        console.error('Send Message error:', err);
      })
    }
  }
}
