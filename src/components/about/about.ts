import '../../style/components_style/about.scss';
import NavigationBar from '../navigation-bar/navigation';
import {TOKEN_HANDLER} from '../auth/fetch';
import initAbout from './about-ui';

window.customElements.define('navigation-bar', NavigationBar);

const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired(false);
    initAbout();
  });
};
onLoad();
