import './style/style.scss';
import PostsMiniatures from './components/shared-ui/post-miniatures';
import { TOKEN_HANDLER } from './components/auth/fetch';
import NavigationBar from './components/navigation-bar/navigation';

const onLoad = (): void => {
  window.customElements.define('navigation-bar', NavigationBar);
  const PM = new PostsMiniatures();
  PM.initPostsMiniatures(1);
  PM.searchPosts();
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired(false);
  });
};

onLoad();
