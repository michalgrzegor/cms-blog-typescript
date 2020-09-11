import { HttpRequestsInterface } from '../http-requests-interface';

export default class HttpRequestsMainPage extends HttpRequestsInterface {
  constructor() {
    super();
  }

  private getBlogPostsMainPage() {
    return fetch(`${this.URL}blog_posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getBlogPostMainPage({ id }: { id: number }) {
    return fetch(`${this.URL}blog_posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private getBlogPostsMainPageByNumber({ pageNumb }: { pageNumb: number }) {
    return fetch(`${this.URL}blog_posts?page=${pageNumb}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  blogPostsMainPageReq(): any {
    const getBlogPostsMainPage = this.getBlogPostsMainPage;
    const getBlogPostMainPage = this.getBlogPostMainPage;
    const getBlogPostsMainPageByNumber = this.getBlogPostsMainPageByNumber;
    const module = this;
    return {
      getBlogPostsMainPage: function () {
        return getBlogPostsMainPage.bind(module)();
      },
      getBlogPostMainPage: function (id: number) {
        return getBlogPostMainPage.bind(module)({
          id: id,
        });
      },
      getBlogPostsMainPageByNumber: function (pageNumb: number) {
        return getBlogPostsMainPageByNumber.bind(module)({
          pageNumb: pageNumb,
        });
      },
    };
  }
}
