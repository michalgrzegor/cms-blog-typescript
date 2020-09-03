import '../../style/components_style/admin-panel.scss';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {handleRedirect} from '../auth/pkce';
import {TOKEN_HANDLER} from '../auth/fetch';
import NavigationBar from '../navigation-bar/navigation';
import {initEditor} from './admin-panel-ui/text-editor';
import {initAdminNav} from './admin-navigation';

const onLoad = () => {
  window.customElements.define('navigation-bar', NavigationBar);
  window.addEventListener('load', () => {
    initEditor();
    initAdminNav();
    handleRedirect().then(() => TOKEN_HANDLER.setIsExpired(true));
  });
};
onLoad();
