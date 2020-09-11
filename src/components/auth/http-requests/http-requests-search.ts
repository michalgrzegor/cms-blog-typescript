import { SearchData, ColectedSearchData } from '../../interfaces/fetch-interfaces';
import { HttpRequestsInterface } from '../http-requests-interface';

export default class HttpRequestsSearch extends HttpRequestsInterface {
  constructor() {
    super();
  }

  private searchBlogPosts({ searchData }: SearchData) {
    return fetch(`${URL}blog_post_searches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData),
    });
  }

  searchBlogPostsReq(): any {
    const searchBlogPosts = this.searchBlogPosts;
    const module = this;
    return {
      searchBlogPosts: function (searchData: ColectedSearchData) {
        return searchBlogPosts.bind(module)({
          searchData: searchData,
        });
      },
    };
  }
}
