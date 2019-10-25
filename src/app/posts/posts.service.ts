import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts : Post[] = [];

    private postsUpdated = new Subject<Post[]>();

    getPosts(){
        return [...this.posts];
    }

    getPostUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string){
        console.log(' adding post');
        const post: Post = {title: title, content: content};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}