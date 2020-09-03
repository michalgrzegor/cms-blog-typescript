import '../../style/style.scss';
import {createLoader} from '../shared-ui/loader';
import {login} from '../auth/pkce';

const onLoad = () => {
  window.addEventListener('load', () => {
    createLoader(document.body);
    login();
  });
};
onLoad();
