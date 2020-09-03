import '../../style/style.scss';
import Loader from '../shared-ui/loader';
import { login } from '../auth/pkce';

(function onLoad() {
  const loader = new Loader();
  loader.createLoader(document.body);
  login();
})();
