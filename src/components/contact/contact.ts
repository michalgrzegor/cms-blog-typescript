import '../../style/components_style/contact.scss';
import NavigationBar from '../navigation-bar/navigation';
import {TOKEN_HANDLER} from '../auth/fetch';

window.customElements.define('navigation-bar', NavigationBar);

const initMap = () => {
  const template = document.querySelector(`template`);
  const templateClone = template.content.cloneNode(true);
  document.querySelector('.contact__map').appendChild(templateClone);
};

const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired(false);
    initMap();
  });
};
onLoad();
