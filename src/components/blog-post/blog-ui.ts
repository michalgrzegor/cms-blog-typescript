import {
  BlogPost,
  BlogPostContentElementAttributes,
  BlogPostContentElement,
} from '../interfaces/blog-post-interfaces';
import twitter from '../../assets/img/twitter.png';
import facebook from '../../assets/img/facebook.png';
import commentlogo from '../../assets/img/commentlogo.png';
import { blogPostsMainPageReq } from '../auth/fetch';
import Loader from '../shared-ui/loader';
import { ColectedPostData } from '../interfaces/fetch-interfaces';
import ImageLoader from '../shared-ui/image-loader';

export default class BlogPostInterface {
  private blogPostData: BlogPost | ColectedPostData;
  private postContainer: HTMLElement;
  private loader: Loader;

  constructor(blogPostData: BlogPost | ColectedPostData = null) {
    this.blogPostData = blogPostData;
    this.postContainer = document.querySelector('.article');
    this.loader = new Loader();
  }

  private createTitle(): void {
    const header: HTMLHeadingElement = document.createElement('h1');
    header.innerHTML = this.blogPostData.title;
    this.postContainer.appendChild(header);
  }

  private createAuthor(): void {
    const articleData: HTMLDivElement = document.createElement('div');
    articleData.classList.add('article__data');
    const date: string = new Date(this.blogPostData.last_update_date).toLocaleDateString();
    const srcData: string =
      (this.blogPostData as BlogPost).author_avatar_url ||
      `https://api.adorable.io/avatars/40/${this.blogPostData.author}.png`;
    const articleDataBody = `      
      <div class="article__author">
        <img src="${srcData}" class="article__author-avatar" alt="" />
        <div>
          <div class="article__author-name">${this.blogPostData.author}</div>
          <div class="article__date">${date}</div>
        </div>
      </div>
      <div class="articel__media">
        <a href="#" class="article__media-link"
          ><img src="${twitter}" alt="" class="article__media-icon"
        /></a>
    
        <a href="#" class="article__media-link"
          ><img src="${facebook}" alt="" class="article__media-icon"
        /></a>
    
        <a href="#" class="article__media-link"
          ><img src="${commentlogo}" alt="" class="article__media-icon"
        /></a>
      </div>`;
    articleData.innerHTML = articleDataBody;
    this.postContainer.appendChild(articleData);
  }

  private createAtributesClasses(attributes: BlogPostContentElementAttributes): string {
    let cssClass: string = '';
    const attrArray: string[] = Object.keys(attributes);
    attrArray.forEach((key) => {
      cssClass = `${cssClass} article--style-${key}`;
    });
    return cssClass;
  }

  private createTag(element: BlogPostContentElement): string {
    return element.attributes && element.attributes.header ? `h${element.attributes.header}` : 'p';
  }

  private appendElement(el: BlogPostContentElement, paragraphContent: string): void {
    const paragraph: HTMLElement = document.createElement(this.createTag(el));
    paragraph.innerHTML = paragraphContent;
    this.postContainer.appendChild(paragraph);
  }

  private appendImage(src: string): void {
    const img: HTMLImageElement = new Image();
    const imageLoaderElement: HTMLDivElement = document.createElement('div');
    const imgContainer: HTMLDivElement = document.createElement('div');
    imageLoaderElement.classList.add('image__loader');
    imgContainer.appendChild(img);
    imgContainer.appendChild(imageLoaderElement);
    this.postContainer.appendChild(imgContainer);
    const imageLoader = new ImageLoader(src, imgContainer);
    imageLoader.imageLoader();
  }

  private createPost(): void {
    const bodyArray: BlogPostContentElement[] = this.blogPostData.data.ops;
    let paragraphContent: string = '';
    bodyArray.forEach((el: BlogPostContentElement, index: number) => {
      const isLast: boolean = index === bodyArray.length - 1;
      if (el.insert !== '\n' && !el.attributes && !isLast && !el.insert.image) {
        paragraphContent = `${paragraphContent}${el.insert}`;
      } else if (el.insert !== '\n' && el.attributes && !isLast && !el.insert.image) {
        paragraphContent = `${paragraphContent}<span class="${this.createAtributesClasses(
          el.attributes
        )}">${el.insert}</span>`;
      } else if (el.insert.image) {
        if (paragraphContent) this.appendElement(el, paragraphContent);
        this.appendImage(el.insert.image);
        paragraphContent = '';
      } else if (el.insert !== '\n' && !el.attributes && isLast && !el.insert.image) {
        paragraphContent = `${paragraphContent}${el.insert}`;
        if (paragraphContent) this.appendElement(el, paragraphContent);
        paragraphContent = '';
      } else {
        if (paragraphContent) this.appendElement(el, paragraphContent);
        paragraphContent = '';
      }
    });
  }

  private getPostId(): number {
    return Number(new URLSearchParams(window.location.search).get('id'));
  }

  private getBlogPost(): Promise<any> {
    return blogPostsMainPageReq().getBlogPostMainPage(this.getPostId());
  }

  createBlogPost(): void {
    this.createTitle();
    this.createAuthor();
    this.createPost();
  }

  initBlogPost(): void {
    this.loader.createLoader(document.body);
    this.getBlogPost()
      .then((res) => res.json())
      .then((res) => (this.blogPostData = res))
      .then(() => this.createBlogPost())
      .then(() => this.loader.removeLoader());
  }
}
