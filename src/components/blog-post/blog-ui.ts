import {
  BlogPost,
  BlogPostContentElementAttributes,
  BlogPostContentElement,
} from '../interfaces/blog-post-interfaces';
import twitter from '../../assets/img/twitter.png';
import facebook from '../../assets/img/facebook.png';
import commentlogo from '../../assets/img/commentlogo.png';
import { blogPostsMainPageReq } from '../auth/fetch';
import { createLoader, removeLoader } from '../shared-ui/loader';
import { ColectedPostData } from '../interfaces/fetch-interfaces';

const createTitle = (resJson: BlogPost | ColectedPostData) => {
  const header = document.createElement('h1');
  header.innerHTML = resJson.title;
  const postContainer = document.querySelector('.article');
  postContainer.appendChild(header);
};

const createAuthor = (resJson: BlogPost | ColectedPostData) => {
  const postContainer = document.querySelector('.article');
  const articleData = document.createElement('div');
  articleData.classList.add('article__data');
  const date = new Date(resJson.last_update_date).toLocaleDateString();
  const srcData =
    (resJson as BlogPost).author_avatar_url ||
    `https://api.adorable.io/avatars/40/${resJson.author}.png`;
  const articleDataBody = `      
    <div class="article__author">
      <img src="${srcData}" class="article__author-avatar" alt="" />
      <div>
        <div class="article__author-name">${resJson.author}</div>
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
  postContainer.appendChild(articleData);
};

const createAtributesClasses = (attributes: BlogPostContentElementAttributes) => {
  let cssClass = ``;
  const attrArray = Object.keys(attributes);
  attrArray.forEach((key) => {
    cssClass = `${cssClass} article--style-${key}`;
  });
  return cssClass;
};

const createTag = (element: BlogPostContentElement) =>
  element.attributes && element.attributes.header ? `h${element.attributes.header}` : 'p';

const appendElement = (
  el: BlogPostContentElement,
  paragraphContent: string,
  postContainer: HTMLElement
) => {
  const paragraph = document.createElement(createTag(el));
  paragraph.innerHTML = paragraphContent;
  postContainer.appendChild(paragraph);
};

const appendImage = (src: string, postContainer: HTMLElement) => {
  const img = new Image();
  img.src = src;
  postContainer.appendChild(img);
};

const createPost = (resJson: BlogPost | ColectedPostData) => {
  const bodyArray = resJson.data.ops;
  const postContainer = document.querySelector<HTMLElement>('.article');
  let paragraphContent = '';
  bodyArray.forEach((el: BlogPostContentElement, index: number) => {
    const isLast = index === bodyArray.length - 1;
    if (el.insert !== '\n' && !el.attributes && !isLast && !el.insert.image) {
      paragraphContent = `${paragraphContent}${el.insert}`;
    } else if (el.insert !== '\n' && el.attributes && !isLast && !el.insert.image) {
      paragraphContent = `${paragraphContent}<span class="${createAtributesClasses(
        el.attributes
      )}">${el.insert}</span>`;
    } else if (el.insert.image) {
      if (paragraphContent) appendElement(el, paragraphContent, postContainer);
      appendImage(el.insert.image, postContainer);
      paragraphContent = '';
    } else if (el.insert !== '\n' && !el.attributes && isLast && !el.insert.image) {
      paragraphContent = `${paragraphContent}${el.insert}`;
      if (paragraphContent) appendElement(el, paragraphContent, postContainer);
      paragraphContent = '';
    } else {
      if (paragraphContent) appendElement(el, paragraphContent, postContainer);
      paragraphContent = '';
    }
  });
};

const getPostId = (): number => Number(new URLSearchParams(window.location.search).get('id'));

const getBlogPost = () => blogPostsMainPageReq().getBlogPostMainPage(getPostId());

export const createBlogPost = (res: BlogPost | ColectedPostData) => {
  createTitle(res);
  createAuthor(res);
  createPost(res);
};

export const initBlogPost = () => {
  createLoader(document.body);
  getBlogPost()
    .then((res) => res.json())
    .then((res) => createBlogPost(res))
    .then(() => removeLoader());
};
