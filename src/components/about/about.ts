import '../../style/components_style/about.scss';
import NavigationBar from '../navigation-bar/navigation';
import { TOKEN_HANDLER } from '../auth/fetch';
import AboutPage from './about-ui';

(function onLoad() {
  window.customElements.define('navigation-bar', NavigationBar);
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired(false);
    const aboutPage = new AboutPage();
    aboutPage.initAbout();
  });
})();
