import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html'
})
export class PostCreateComponent implements OnInit{
 
    enteredTitle = '';
    enteredContent = '';
    private mode = 'create';
    private postId: string;
    post: Post;

    constructor(public postService: PostsService, public route: ActivatedRoute){}

    ngOnInit(){
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId');
                this.post = this.postService.getPost(this.postId);
            }else{
                this.mode = 'create';
                this.postId = null;
            }
        });
    }

    onSavePost(form: NgForm){
        if (form.invalid){
            return;
        }
        if (this.mode == 'create'){
            this.postService.addPost(form.value.title, form.value.content);
        }else{
            this.postService.updatePost(this.postId, form.value.title, form.value.content);
        }
        form.reset();
    }
}