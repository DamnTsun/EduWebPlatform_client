import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Post } from 'src/app/classes/Posts';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-subject-news',
  templateUrl: './subject-news.component.html',
  styleUrls: ['./subject-news.component.css']
})
export class SubjectNewsComponent implements OnInit {

  // Subject being viewed and whether user is admin.
  private subjectid = null;
  public isAdmin: boolean = false;

  // Vars for handling posts, such as the currently stored posts, number to get / skip for api, whether end of posts reached.
  public posts$: Post[] = [];
  private count: number = 10;
  private offset: number = 0;
  public endOfContent: boolean = false;





  constructor(
    private subjectService: SubjectsService,
    private signIn: SignInService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {
    // Get route params.
    this.subjectid = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    this.subjectService.setSubject(this.subjectid);


    // Get whether user is an admin.
    this.signIn.userIsAdmin().subscribe((isAdmin: boolean) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Subject News user admin status Error:', err);
    });


    // Get initial posts to show.
    this.getPosts();
  }


  /**
   * Scroll event for infinite scroll.
   */
  public onScroll(): void {
    if (!this.endOfContent) {
      this.getPosts();
    }
  }


  /**
   * Attempts to get more posts from api.
   */
  public getPosts(): void {
    this.subjectService.getPosts(this.subjectid, this.count, this.offset).subscribe((posts: Post[]) => {
      // Check any posts fetched.
      if (posts.length > 0) {
        this.posts$ = this.posts$.concat(posts);
        this.offset += posts.length;
        // If less posts fetched than asked for, must have hit end of content.
        if (posts.length < this.count) {
          this.endOfContent = true;
        }
      } else {
        // Empty list fetched. Must be end of content.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error('Subject News get posts Error:', err);
    })
  }



  // Index of post to be deleted. Used by delete modal.
  public deletePostIndex = null;
  /**
   * Deletes new post at given index in array.
   * @param index - index of news post in array.
   */
  public deletePost(index) {
    // Check index valid.
    if (index < 0 || index >= this.posts$.length) {
      return;
    }

    // Attempt to delete.
    this.subjectService.deletePost(this.subjectid, this.posts$[index].id).subscribe((res) => {
      // Successful. Remove post and decrement offset by 1.
      this.posts$ = this.posts$.filter((ele, i) => { return i !== index });
      this.offset--;
    }, (err) => {
      console.error('Subject News delete post Error:', err);
    });
  }
}
