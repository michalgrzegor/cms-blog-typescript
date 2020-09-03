import '../../style/shared/blog-post.scss';
import NavigationBar from '../navigation-bar/navigation';
import {TOKEN_HANDLER} from '../auth/fetch';
import {initBlogPost} from './blog-ui';

window.customElements.define('navigation-bar', NavigationBar);

const onLoad = () => {
  window.addEventListener('load', () => {
    initBlogPost();
    TOKEN_HANDLER.setIsExpired(false);
  });
};

onLoad();
