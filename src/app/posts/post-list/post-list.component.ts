import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

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
       
    constructor(public postService: PostsService){}

    ngOnInit(){
        this.isLoading = true;
        this.postService.getPosts(this.postsPerPage, this.currentPage);
        this.postSub = this.postService.getPostUpdatedListener().subscribe(
            ((postData: {posts: Post[], postCount: number}) => 
            {   
                this.posts = postData.posts;
                this.isLoading = false;
            }
        ));
    }

    onChangedPage(pageData: PageEvent){
        this.isLoading = true;
        console.log(' pageData' + pageData);
        this.postsPerPage = pageData.pageSize;
        this.currentPage = pageData.pageIndex + 1;
        this.postService.getPosts(this.postsPerPage, this.currentPage);

    }

    onDelete(postId: string){
        this.isLoading = true;
       /* this.postService.deletePost(postId).subscribe(() => {
            this.postService.getPosts(this.postsPerPage, this.currentPage);
        });*/
    }

    ngOnDestroy(){
        this.postSub.unsubscribe();
    }
}