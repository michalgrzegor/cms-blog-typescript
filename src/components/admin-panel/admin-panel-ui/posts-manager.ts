import { PostListElement } from './../../interfaces/admin-panel-interfaces';
import ManagerFunctions from './shared-functions';
import authMediator from '../../auth/auth-mediator';

export default class PostsManager extends ManagerFunctions {
  renderPostsManager = (postsList: PostListElement[]) => {
    if (postsList.length > 0) {
      this.renderLegend('post', postsList);
      this.renderTable();
    }
    this.loader.removeLoader();
  };

  initPostsManager = () => {
    this.loader.showLoader(document.body);
    authMediator
      .handleRequest('blog post requests')
      .then((r) => {
        return r.getAllBlogPosts();
      })
      .then((response) => response.json())
      .then(this.renderPostsManager)
      .catch((err) => {
        this.snackBar.showSnackBar('something went wrong, try again');
        this.loader.removeLoader();
      });
  };
}
