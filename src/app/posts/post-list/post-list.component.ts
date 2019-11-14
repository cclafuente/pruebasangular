import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
 
    totalPosts = 10;
    postsPerPage = 5;
    pageSizeOptions = [1, 2, 5, 10];
    currentPage = 1;
    posts: Post[] = [];
    private postSub : Subscription;
    isLoading = false;
    private authStatusSub : Subscription;
    private userIsAuthenticated = false;
    userId: string;
       
    constructor(public postService: PostsService, private authService: AuthService){

    }

    ngOnInit(){
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.postSub = this.postService.getPostUpdatedListener().subscribe(
            ((postData: {posts: Post[], postCount: number}) => 
            {   
                this.posts = postData.posts;
                this.totalPosts = postData.postCount;
                this.isLoading = false;
            }
        ));
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        });
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        this.postsPerPage = pageData.pageSize;
        this.currentPage = pageData.pageIndex + 1;
        this.postService.getPosts(this.postsPerPage, this.currentPage);

    }

    onDelete(postId: string){
        this.isLoading = true;
        this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPosts(this.postsPerPage, this.currentPage);
        });
    }

    ngOnDestroy(){
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }
}