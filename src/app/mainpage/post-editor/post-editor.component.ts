import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MessageService
} from 'primeng/api';
import {
  EditorService
} from 'src/app/services/editor.service';
import {
  PostsService
} from 'src/app/services/posts.service';
import {
  environment
} from 'src/environments/environment';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss']
})
export class PostEditorComponent implements OnInit {

  idPostToReblog: string | undefined;
  editorVisible: boolean = false;
  postCreatorContent: string = '';
  tags: string[] = [];
  captchaResponse: string | undefined;
  captchaKey = environment.recaptchaPublic;

  // upload media variables
  displayUploadImagePanel = false;
  newImageDescription = '';
  newImageNSFW = false;
  newImageFile: File | undefined;
  uploadImageUrl = environment.baseUrl + '/uploadMedia';
  @ViewChild('uploadImagesPanel') uploadImagesPanel: any;


  constructor(
    private editorService: EditorService,
    private postsService: PostsService,
    private messages: MessageService


  ) {

    this.editorService.launchPostEditorEmitter.subscribe((elem) => {
      if (elem) {
        this.idPostToReblog = elem.length === 36 ? elem : undefined;
        this.editorVisible = true;
      }
    });
  }

  ngOnInit(): void {}


  // editor methods

  newEditor() {
    this.idPostToReblog = undefined;
    this.openEditor();
  }


  openEditor() {
    this.editorVisible = true;
  }

  postBeingSubmitted = false;
  async submitPost() {
    this.postBeingSubmitted = true;
    let tagsToSend = '';
    this.tags.forEach((elem) => {
      tagsToSend = tagsToSend + elem.trim() + ',';
    });
    tagsToSend = tagsToSend.slice(0, -1);
    let res = undefined;
    if (this.captchaResponse) {
      res = await this.editorService.createPost(this.postCreatorContent, this.captchaResponse, tagsToSend, this.idPostToReblog);
    }
    if (res) {
      this.messages.add({
        severity: 'success',
        summary: 'Your post has been published!'
      });
      this.postCreatorContent = '';
      this.tags = [];
      this.editorVisible = false;
    } else {
      this.messages.add({
        severity: 'warn',
        summary: 'Something went wrong and your post was not published. Check your internet connection and try again'
      });

    }
    this.postBeingSubmitted = false;
  }

  closeEditor() {
    this.editorVisible = false;
  }

  captchaResolved(event: any) {
    this.captchaResponse = event.response;

  }

  captchaExpired() {
    this.captchaResponse = undefined;
  }

  imgSelected(filePickerEvent: any) {
    if (filePickerEvent.target.files[0]) {
      this.newImageFile = filePickerEvent.target.files[0];
    }
  }

  uploadImage(evt: any) {
    let response = evt.originalEvent.body[0]
    if (response) {
      this.newImageDescription = '';
      this.newImageNSFW = false;
      this.newImageFile = undefined;
      this.displayUploadImagePanel = false;
      this.postCreatorContent = this.postCreatorContent + '[wafrnmediaid="' + response.id + '"]'
      this.uploadImagesPanel.hide();
      this.messages.add({
        severity: 'success',
        summary: 'Image uploaded and added to the post!'
      });
    }

  }

  uploadImageFailed() {
    this.messages.add({
      severity: 'error',
      summary: 'Image upload failed! Please send us details'
    });
  }



}
