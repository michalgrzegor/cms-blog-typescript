import '../../style/components_style/auth.scss';
import RenderForms from './render-forms';

(function onLoad() {
  const renderForm: RenderForms = new RenderForms(document.querySelector('.auth__form'));
  renderForm.renderForm('form__signup');
})();
