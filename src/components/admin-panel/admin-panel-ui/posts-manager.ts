import { PostListElement } from './../../interfaces/admin-panel-interfaces';
import ManagerFunctions from './shared-functions';
import { blogPostReq } from '../../auth/fetch';
import { createLoader, removeLoader } from '../../shared-ui/loader';
import showSnackBar from '../../shared-ui/snackbar';

const mf = new ManagerFunctions();

const renderPostsManager = (postsList: PostListElement[]) => {
  if (postsList.length > 0) {
    mf.renderLegend('post', postsList);
    mf.renderTable();
  }
  removeLoader();
};

const initPostsManager = () => {
  createLoader(document.body);
  blogPostReq()
    .getAllBlogPosts()
    .then((response) => response.json())
    .then(renderPostsManager)
    .catch((err) => {
      showSnackBar('something went wrong, try again');
      removeLoader();
    });
};

export default initPostsManager;
