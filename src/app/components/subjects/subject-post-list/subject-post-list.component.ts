import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../../classes/Posts';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../../../services/site.service';
import { environment } from '../../../../environments/environment';
import { Subject } from '../../../classes/Subject';

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
  private showControls: boolean;
  private count: number;
  private offset: number = 0;

  // Posts current being viewed.
  private posts$: Post[] = null;





  constructor(
    private route: ActivatedRoute,
    private site: SiteService
  ) { }

  ngOnInit() {
    // Convert input values to correct type and store.
    this.showControls = (this.input_showControls.toLowerCase() === 'true');
    this.count = parseInt(this.input_count);

    // Get initial posts for viewing.
    this.getPosts();
  }





  // Methods not used by HTML
  /**
   * Gets posts for displaying based on count and offset values.
   */
  private getPosts(): void {
    // Get subjectid from url.
    let subjectId = this.route.snapshot.paramMap.get(environment.routeParams.subjectid);
    
    // Get subjects.
    this.site.getPosts(subjectId, this.count, this.offset).subscribe((posts) => {
      this.posts$ = posts;
    }, (err) => {
      console.error(err);
    });
  }





  // Methods used by HTML
  /**
   * Decrement offset by count and get posts based on new offset and count.
   */
  private getNewerPosts(): void {
    this.offset -= this.count;
    this.getPosts();
  }
  /**
   * Increment offset by count and get posts based on new offset and count.
   */
  private getOlderPosts(): void {
    this.offset += this.count;
    this.getPosts();
  }





  // Conditions for displaying page.
  /**
   * Returns whether controls (newer/older posts buttons, etc) should be shown.
   */
  private shouldShowControls(): boolean {
    return (this.showControls);
  }
  /**
   * Returns where posts have been fetched. (API queried successfully)
   */
  private postsHaveBeenFetched(): boolean {
    return (this.posts$ != null);
  }
  /**
   * Returns whether API returned any posts. (subject may contain no posts)
   */
  private postsExist(): boolean {
    return (this.posts$ !== null && this.posts$.length > 0);
  }
}
