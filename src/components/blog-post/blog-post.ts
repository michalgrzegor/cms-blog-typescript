import '../../style/shared/blog-post.scss';
import NavigationBar from '../navigation-bar/navigation';
import { TOKEN_HANDLER } from '../auth/http-requests-interface';
import BlogPostInterface from './blog-ui';

(function onLoad() {
  window.customElements.define('navigation-bar', NavigationBar);
  window.addEventListener('load', () => {
    const blogPostInterface = new BlogPostInterface();
    blogPostInterface.initBlogPost();
    TOKEN_HANDLER.setIsExpired(false);
  });
})();
