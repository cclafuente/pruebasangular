import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit, OnDestroy{
 
    posts: Post[] = [];
    private postSub : Subscription;
       
    constructor(public postService: PostsService){}

    ngOnInit(){
        this.posts = this.postService.getPosts();
        this.postSub = this.postService.getPostUpdatedListener().subscribe(
            (posts: Post[]) => 
            {this.posts = posts;}
        );
    }

    ngOnDestroy(){
        this.postSub.unsubscribe();
    }
}