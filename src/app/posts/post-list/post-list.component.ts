import { Component, OnDestroy, OnInit } from '@angular/core';
import {Post} from '../post.model';
import {PostService} from '../post.service';
import { Subscription} from 'rxjs';
import { PageEvent} from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postSub: Subscription;
  private authListenerSubs: Subscription
  userIsAuthenticated: boolean = false;
  isLoading = false;
  userId: string;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];

  constructor(public postService: PostService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postService.getPostUpdateListener().subscribe((postData: {posts: Post[], postCount: number})=>{
      this.isLoading = false;
      this.posts = postData.posts;
      this.totalPosts = postData.postCount;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    })
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  delete(id: string){
    this.postService.deletePost(id).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage,this.currentPage);
    });
  }

  ngOnDestroy(){
    if(this.postSub){
      this.postSub.unsubscribe();
    }
    this.authListenerSubs.unsubscribe();
  }
}
