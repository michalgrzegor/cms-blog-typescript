import { PostListElement } from './../../interfaces/admin-panel-interfaces';
import AdminPanelFunctionsManager from './admin-panel-functions-manager';
import authMediator from '../../auth/auth-mediator';

export default class PostsManager extends AdminPanelFunctionsManager {
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
