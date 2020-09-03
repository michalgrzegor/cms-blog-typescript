import { PostListElement } from './../../interfaces/admin-panel-interfaces';
import ManagerFunctions from './shared-functions';
import { blogPostReq } from '../../auth/fetch';
import Loader from '../../shared-ui/loader';
import showSnackBar from '../../shared-ui/snackbar';

const mf = new ManagerFunctions();
const loader = new Loader();

const renderPostsManager = (postsList: PostListElement[]) => {
  if (postsList.length > 0) {
    mf.renderLegend('post', postsList);
    mf.renderTable();
  }
  loader.removeLoader();
};

const initPostsManager = () => {
  loader.createLoader(document.body);
  blogPostReq()
    .getAllBlogPosts()
    .then((response) => response.json())
    .then(renderPostsManager)
    .catch((err) => {
      showSnackBar('something went wrong, try again');
      loader.removeLoader();
    });
};

export default initPostsManager;
