import '../../style/style.scss';
import Loader from '../shared-ui/loader';
import authMediator from '../auth/auth-mediator';

(function onLoad() {
  const loader = new Loader();
  loader.showLoader(document.body);
  authMediator.handleRequest('login');
})();
