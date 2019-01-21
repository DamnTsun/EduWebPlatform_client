import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Post } from 'src/app/classes/Posts';
import { SubjectsService } from 'src/app/services/contentServices/subjects.service';
import { SignInService } from 'src/app/services/sign-in.service';

@Component({
  selector: 'app-subject-post-list',
  templateUrl: './subject-post-list.component.html',
  styleUrls: ['./subject-post-list.component.css']
})
export class SubjectPostListComponent implements OnInit {

  // Inputs.
  @Input('showControls') input_showControls;
  @Input('count') input_count;
  @Input('title') title = 'News Posts';
  // Inputs after converting from string.
  private doInfiniteScroll: boolean;
  private count: number;
  private offset: number = 0;
  private endOfContent: boolean = false;

  // Posts current being viewed.
  private posts$: Post[] = [];

  private isAdmin: boolean = false;





  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private signIn: SignInService
  ) { }

  ngOnInit() {
    // Convert input values to correct type and store.
    this.doInfiniteScroll = (this.input_showControls.toLowerCase() === 'true');
    if (!this.doInfiniteScroll) { this.endOfContent = true; }
    this.count = parseInt(this.input_count);

    
    // Get user admin status.
    this.signIn.userIsAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    }, (err) => {
      console.error('Subject posts list isAdmin error:', err);
    })


    // Get initial posts for viewing.
    this.getPosts();
  }




  private onScroll() {
    if (!this.endOfContent) {
      this.getPosts();
    }
  }

  // Methods not used by HTML
  /**
   * Gets posts for displaying based on count and offset values.
   */
  private getPosts(): void {
    // Get subjectid from url.
    let subjectId = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    
    // Get subjects.
    this.subjectService.getPosts(subjectId, this.count, this.offset).subscribe((posts) => {
      if (posts.length > 0) {
        this.posts$ = this.posts$.concat(posts);
        this.offset += posts.length;
        if (posts.length < this.count) { this.endOfContent = true; }
      } else {
        // Fetched empty list. Must be end.
        this.endOfContent = true;
      }
    }, (err) => {
      console.error(err);
    });
  }

}
