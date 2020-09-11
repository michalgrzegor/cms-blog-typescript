import '../../style/components_style/admin-panel.scss';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import adminPanelNavigator from './admin-navigation';
import authMediator from '../auth/auth-mediator';
import TOKEN_HANDLER from '../auth/token-handler-instance';
import NavigationBar from '../navigation-bar/navigation';
import textEditor from './admin-panel-ui/text-editor';

const onLoad = () => {
  window.customElements.define('navigation-bar', NavigationBar);
  window.addEventListener('load', () => {
    authMediator.handleRequest('handleRedirect').then(() => TOKEN_HANDLER.setIsExpired(true));
    textEditor.initEditor();
    adminPanelNavigator.initAdminNav();
  });
};
onLoad();
