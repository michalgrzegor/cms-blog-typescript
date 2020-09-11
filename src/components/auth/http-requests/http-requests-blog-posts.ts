import {
  PostData,
  PostID,
  PostIDandData,
  ColectedPostData,
} from '../../interfaces/fetch-interfaces';
import { HttpRequestsInterface } from '../http-requests-interface';

export default class HttpRequestsBlogPosts extends HttpRequestsInterface {
  constructor() {
    super();
  }
  private postBlogPost({ postData }: PostData) {
    return fetch(`${this.URL}quill_blog_posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
      body: JSON.stringify(postData),
    });
  }

  private getBlogPost({ postId }: PostID) {
    return fetch(`${this.URL}quill_blog_posts/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
    });
  }

  private deleteBlogPost({ postId }: PostID) {
    return fetch(`${this.URL}quill_blog_posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
    });
  }

  private getAllBlogPosts() {
    return fetch(`${this.URL}quill_blog_posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
    });
  }

  private updateBlogPost({ postId, postData }: PostIDandData) {
    return fetch(`${this.URL}quill_blog_posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.TOKEN_HANDLER.getToken()}`,
      },
      body: JSON.stringify(postData),
    });
  }

  blogPostReq(): {} {
    const makeRequest = this.makeRequest;
    const postBlogPost = this.postBlogPost;
    const getBlogPost = this.getBlogPost;
    const deleteBlogPost = this.deleteBlogPost;
    const getAllBlogPosts = this.getAllBlogPosts;
    const updateBlogPost = this.updateBlogPost;
    const module = this;
    return {
      postBlogPost: function (postData: ColectedPostData) {
        return makeRequest.bind(module)(postBlogPost.bind(module), {
          postData: postData,
        });
      },
      getBlogPost: function (postId: string) {
        return makeRequest.bind(module)(getBlogPost.bind(module), {
          postId: postId,
        });
      },
      deleteBlogPost: function (postId: string) {
        return makeRequest.bind(module)(deleteBlogPost.bind(module), {
          postId: postId,
        });
      },
      getAllBlogPosts: function () {
        return makeRequest.bind(module)(getAllBlogPosts.bind(module), null);
      },
      updateBlogPost: function (postId: string, postData: ColectedPostData) {
        return makeRequest.bind(module)(updateBlogPost.bind(module), {
          postId: postId,
          postData: postData,
        });
      },
    };
  }
}
