import '../../style/style.scss';
import { createLoader } from '../shared-ui/loader';
import { login } from '../auth/pkce';

(function onLoad() {
  createLoader(document.body);
  login();
})();
