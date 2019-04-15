import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Subject } from 'src/app/classes/Subject';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { NavigationServiceService } from 'src/app/services/navigation-service.service';
import { Post } from 'src/app/classes/Posts';
import { SubjectAdmin } from 'src/app/classes/SubjectAdmin';
import { SignInService } from 'src/app/services/sign-in.service';
import { User } from 'src/app/classes/User';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-subject-home',
  templateUrl: './subject-home.component.html',
  styleUrls: ['./subject-home.component.css']
})
export class SubjectHomeComponent implements OnInit {

  // Whether the current user is signed in.
  public currentUser: User = null;
  public isSubjectAdmin: boolean = null;

  public subjectid = null;
  public subject$: Subject = null;
  public subjectLoadingError: boolean = false;

  // Number of news posts to get.
  public newsCount: number = 3;
  public news$: Post[] = [];
  public noNewsPosts: boolean = false;
  public newsLoadingError: boolean = false;

  // Variables for handling subject admin display.
  private subjectAdminCount: number = 12;
  private subjectAdminOffset: number = 0;
  public subjectAdminsEndOfContent: boolean = false;
  public subjectAdmins$: SubjectAdmin[] = [];
  public subjectAdminsLoadingError: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subjectService: SubjectsService,
    private signIn: SignInService,
    public navService: NavigationServiceService,
    public util: UtilService
  ) { }


  ngOnInit() {
    // Get route params, set subject.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(this.subjectid);


    // Get whether user is signed in.
    this.signIn.userInternalRecord().subscribe((user: User[]) => {
      if (user !== null) {
        this.currentUser = user[0];

        this.loadInitialSubjectAdmins();
      }
    }, (err) => {
      console.error('SubjectHome user signed in Error:', err);
    });


    // Subscribe to subject record to get its data.
    this.subjectService.subject().subscribe((subject) => {
      this.subject$ = subject;
    }, (err) => {
      this.subjectLoadingError = true;
      console.error('SubjectHome get subject Error:', err);
    });


    // Get newCount number of news posts to display.
    this.subjectService.getPosts(this.subjectid, this.newsCount, 0).subscribe((posts: Post[]) => {
      this.news$ = posts;
      if (posts.length === 0) { this.noNewsPosts = true; }
    }, (err) => {
      this.newsLoadingError = true;
      console.error('SubjectHome get recent news Error:', err);
    });
  }

  private loadInitialSubjectAdmins() {
    if (this.currentUser !== null) {
      // If user is admin, get whether the are a subject admin for this subject.
      if (this.currentUser.admin) {
        this.subjectService.getCurrentUserSubjectAdminStatus(this.subjectid).subscribe((res: { isSubjectAdmin }) => {
          this.isSubjectAdmin = res.isSubjectAdmin;
        }, (err) => {
          console.error('GroupHome get whether admin is subject admin Error:', err);
        })
      }

      this.getSubjectAdmins();
    }
  }


  /**
   * Scroll event for subject admins infinite scroll list.
   */
  public subjectAdmins_onScroll(): void {
    // Only if not at end of content and the current user is signed in.
    if (!this.subjectAdminsEndOfContent && this.currentUser !== null) {
      this.getSubjectAdmins();
    }
  }


  /**
   * Attempts to get more subject admins from the api.
   */
  private getSubjectAdmins(): void {
    this.subjectService.getSubjectAdmins(this.subjectid, this.subjectAdminCount, this.subjectAdminOffset)
      .subscribe((subjectAdmins: SubjectAdmin[]) => {
        // Check how many subject admin records fetched.
        if (subjectAdmins.length > 0) {
          this.subjectAdmins$ = this.subjectAdmins$.concat(subjectAdmins);
          this.subjectAdminOffset += subjectAdmins.length;
          // If less records fetched than asked for, must be end of content.
          if (subjectAdmins.length < this.subjectAdminCount) {
            this.subjectAdminsEndOfContent = true;
          }
        } else {
          // No records received. Must be end of content.
          this.subjectAdminsEndOfContent = true;
        }
      }, (err) => {
        this.subjectAdminsLoadingError = true;
        console.error('SubjectHome get subject admins Error:', err);
      });
  }


  /**
   * Sets the subject admin status of the current user.
   * @param state - Whether to become or stop being a subject admin.
   */
  public setSubjectAdminStatus(state: boolean) {
    if (state) {
      // Become subject admin.
      this.subjectService.addMyselfAsSubjectAdmin(this.subjectid).subscribe((res) => {
        // Success. Add yourself to list if id is less than current highest id of admin.
        if (Number.parseInt(this.subjectAdmins$[this.subjectAdmins$.length - 1].id) > Number.parseInt(res[0].id)) {
          this.subjectAdmins$.push(res[0]);
          this.subjectAdminOffset++;
          // Sort.
          this.subjectAdmins$.sort((a, b) => { return Number.parseInt(a.id) - Number.parseInt(b.id) });
        }
        // Invert subject admin status.
        this.isSubjectAdmin = !this.isSubjectAdmin;
      }, (err) => {
        console.error('GroupHome associate with subject Error:', err);
      })
    } else {
      // Stop being subject admin.
      this.subjectService.removeMyselfAsSubjectAdmin(this.subjectid).subscribe((res) => {
        // Success. Remove yourself from list if on list.
        let len = this.subjectAdmins$.length;
        this.subjectAdmins$ = this.subjectAdmins$.filter((ele) => { return ele.id !== this.currentUser.id; });
        if (this.subjectAdmins$.length < len) {
          this.subjectAdminOffset--;
        }
        // Invert subject admin status.
        this.isSubjectAdmin = !this.isSubjectAdmin;
      }, (err) => {
        console.error('GroupHome dissassociate with subject Error:', err);
      })
    }
  }
}
