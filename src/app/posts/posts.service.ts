import { Post } from "./post.model";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class PostsService {
    private posts : Post[] = [];

    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPosts(){
        return this.http.get<{message: 'string', posts: Post[]}>('http://localhost:3000/api/posts').
        subscribe((postData) => {
            this.posts = postData.posts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string){
        console.log(' adding post');
        const post: Post = {id: null, title: title, content: content};
        this.http.post('http://localhost:3000/api/posts', post).subscribe((responseData) => {
            console.log(' enviando contenido al servidor ');
        });
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
    }
}