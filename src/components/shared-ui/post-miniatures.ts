import { PostMiniature, PostMiniatureResponse } from '../interfaces/post-miniature-interfaces';
import Loader from './loader';
import ImageLoader from './image-loader';
import SnackBar from './snackbar';
import authMediator from '../auth/auth-mediator';

export default class PostsMiniatures {
  postMiniaturesArray: PostMiniature[][];
  paginationNumber: number;
  pageNumber: number;
  isSearchMode: boolean;
  query: string;
  loader: Loader;
  snackBar: SnackBar;

  constructor() {
    this.postMiniaturesArray = [];
    this.paginationNumber = null;
    this.pageNumber = 1;
    this.isSearchMode = false;
    this.loader = new Loader();
    this.snackBar = new SnackBar();
  }

  getPostTemplate() {
    const template: HTMLTemplateElement = document.querySelector('#miniature__template');
    return template.content.cloneNode(true) as HTMLElement;
  }

  generateMiniature(postMin: PostMiniature): HTMLElement {
    const postTemplate = this.getPostTemplate();
    const avatarLoader = new ImageLoader(
      postMin.author_avatar_url || `https://api.adorable.io/avatars/40/${postMin.author}.png`,
      postTemplate.querySelector('.miniature__author')
    );
    const mainImageLoader = new ImageLoader(
      postMin.main_image_url || 'https://picsum.photos/900',
      postTemplate.querySelector('.miniature__img')
    );
    postTemplate.querySelector('.miniature__title').textContent = postMin.title;
    postTemplate.querySelector('.author__name').textContent = postMin.author;
    postTemplate.querySelector('.post__date').textContent = postMin.create_date;
    postTemplate.querySelector('.miniature__opening').textContent = postMin.introduction;
    postTemplate.querySelector('.post__comments').textContent = `${postMin.comments || '0'}`;
    postTemplate.querySelector('.miniature').setAttribute('postId', `${postMin.id}`);
    (postTemplate.querySelector(
      '.miniature'
    ) as HTMLAnchorElement).href = `./blog-post?id=${postMin.id}`;
    avatarLoader.imageLoader();
    mainImageLoader.imageLoader();

    return postTemplate;
  }

  renderPostsMin(postsMins: PostMiniature[]) {
    const container = document.querySelector('.container');
    container.querySelectorAll('a').forEach((a) => a.remove());
    postsMins.forEach((postMin: PostMiniature) =>
      container.insertBefore(
        this.generateMiniature(postMin),
        container.querySelector('.miniature__pages')
      )
    );
    Array.from(document.querySelectorAll('.miniature__page'))[this.pageNumber - 1].classList.add(
      'font--weight-bold'
    );
  }

  generateArrays(postMins: PostMiniatureResponse) {
    const postMiniaturesArray = [];
    const ite = Math.ceil(postMins.blog_posts.length / 10);
    for (let i = 0; i < ite; i += 1) {
      const ar = postMins.blog_posts.slice(i * 10, i * 10 + 10);
      postMiniaturesArray.push(ar);
    }
    return postMiniaturesArray;
  }

  cratePage(number: number) {
    const paragraph = document.createElement('p');
    paragraph.classList.add('miniature__page');
    paragraph.textContent = `${number + 1}`;
    return paragraph;
  }

  changePage(target: HTMLParagraphElement) {
    if (target.classList.contains('miniature__page')) {
      document
        .querySelectorAll('.miniature__page')
        .forEach((p) => p.classList.remove('font--weight-bold'));
      this.pageNumber = Number(target.textContent);
      if (
        this.pageNumber === this.paginationNumber * 2 ||
        this.pageNumber === this.paginationNumber * 2 - 1
      ) {
        this.renderPostsMin(this.postMiniaturesArray[Number(target.textContent) - 1]);
      } else {
        document.querySelector('.miniature__pages').remove();
        if (!this.isSearchMode) this.initPostsMiniatures(Math.ceil(this.pageNumber / 2));
        if (this.isSearchMode)
          this.getSearchRequest(this.query, Math.ceil(this.pageNumber / 2), this.pageNumber);
      }
    }
  }

  generatePages(number: number) {
    if (document.querySelector('.miniature__pages'))
      document.querySelector('.miniature__pages').remove();
    const container = document.querySelector('.container');
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('miniature__pages');
    const arrayOfPages = [...Array(Math.ceil(number / 10)).keys()];
    arrayOfPages.forEach((page) => pagesContainer.appendChild(this.cratePage(page)));
    pagesContainer.addEventListener('click', (e) =>
      this.changePage(<HTMLParagraphElement>e.target)
    );
    container.appendChild(pagesContainer);
  }

  async getSearchRequest(query: string, number: number, pageNumber: number) {
    this.query = query;
    this.isSearchMode = query !== '';
    this.paginationNumber = number;
    this.pageNumber = pageNumber;
    if (this.isSearchMode) {
      document.querySelector('.container').innerHTML = '';
      this.loader.showLoader(document.querySelector('.container'));
      const postMins = await authMediator
        .handleRequest('search requests')
        .then((r) =>
          r.searchBlogPosts({
            search: query,
            page: number,
          })
        )
        .then((r) => r.json());
      if (postMins.blog_posts.length > 0) {
        this.postMiniaturesArray = this.generateArrays(postMins);
        this.generatePages(postMins.blog_posts_count);
        this.renderPostsMin(this.postMiniaturesArray[0]);
      }
      this.loader.removeLoader();
    }
    if (!this.isSearchMode) {
      this.pageNumber = 1;
      this.initPostsMiniatures(1);
    }
  }

  searchPosts() {
    const input: HTMLInputElement = document.querySelector('.blog__search input');
    let timer: number = null;
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        this.getSearchRequest(input.value, 1, 1);
      }, 1000);
    });
  }

  async initPostsMiniatures(number: number): Promise<any> {
    this.loader.showLoader(document.body);
    this.paginationNumber = number;
    const postMins = await authMediator
      .handleRequest('main page requests')
      .then((r) => r.getBlogPostsMainPageByNumber(number))
      .then((r) => r.json())
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
    if (postMins.blog_posts.length > 0) {
      this.postMiniaturesArray = this.generateArrays(postMins);
      this.generatePages(postMins.blog_posts_count);
      this.renderPostsMin(this.postMiniaturesArray[0]);
    }
    this.loader.removeLoader();
  }
}
