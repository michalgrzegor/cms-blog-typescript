import '../../style/components_style/contact.scss';
import NavigationBar from '../navigation-bar/navigation';
import { TOKEN_HANDLER } from '../auth/fetch';

(function onLoad() {
  function initMap(): void {
    const template: HTMLTemplateElement = document.querySelector(`template`);
    const templateClone: Node = template.content.cloneNode(true);
    document.querySelector('.contact__map').appendChild(templateClone);
  }
  window.customElements.define('navigation-bar', NavigationBar);
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired(false);
    initMap();
  });
})();
