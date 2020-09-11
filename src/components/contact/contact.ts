import '../../style/components_style/contact.scss';
import TOKEN_HANDLER from '../auth/token-handler-instance';
import NavigationBar from '../navigation-bar/navigation';

(function onLoad() {
  function initMap(): void {
    const template: HTMLTemplateElement = document.querySelector(`template`);
    const templateClone: Node = template.content.cloneNode(true);
    document.querySelector('.contact__map').appendChild(templateClone);
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      TOKEN_HANDLER.setIsExpired(false);
      window.customElements.define('navigation-bar', NavigationBar);
    }, 1);
    initMap();
  });
})();
