import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {mimeType} from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredContent = "";
  enteredTitle = "";
  postId: string;
  private mode = 'create';
  post: Post;
  public isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription;


  constructor(public postService: PostService, public route: ActivatedRoute, public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus =>{
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null,
        { validators: [Validators.required],
          asyncValidators: [mimeType]
      })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has('postId')){
        this.postId = paramMap.get('postId')
        this.mode= 'edit';
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath, creator:postData.creator};
          this.form.setValue({title: this.post.title, content: this.post.content, image: this.post.imagePath});
        })

      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }


  onSavePost() {
    if(this.form.invalid){
      return;
    }
    this.isLoading = true;
    if(this.mode === "create"){
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else if(this.mode === "edit"){
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    }
    this.form.reset();
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
