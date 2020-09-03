import * as validation from './validation';
import sendForm from './send-form';
import { login } from './pkce';

const switchAction = (event: Event) => {
  if ((<HTMLButtonElement>event.target).type === 'button')
    renderForm((<HTMLButtonElement>event.target).getAttribute('switchTo'));
};

const switchForm = () => {
  const switchContainer = document.querySelector('.form__switchbtn');
  switchContainer.addEventListener('click', (e) => switchAction(e));
};

const renderForm = (formName: string) => {
  if (formName === 'form__login') {
    login();
  } else {
    const container = document.querySelector('.auth__form');
    container.innerHTML = '';
    const template = document
      .querySelector<HTMLTemplateElement>(`#${formName}`)
      .content.cloneNode(true);
    const inputs = (<Element>template).querySelectorAll('input');
    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener('blur', () => {
        validation.validate(input.value, input.type, input.id);
      });
      input.addEventListener('focus', () => {
        validation.removeError(input.id);
      });
    });
    container.appendChild(template);
    sendForm();
    switchForm();
  }
};

export default renderForm;
