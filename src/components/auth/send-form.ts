import { isValid, validate } from './validation';
import * as fetchReq from './fetch';

const send = (formName: string) => {
  if (formName === 'form__signup') {
    fetchReq.signup();
  } else if (formName === 'form__reset') {
    fetchReq.reset();
  }
};

const sendForm = () => {
  const button = document.querySelector('form button');
  const formFields = document.querySelectorAll('input');

  const formName = document.querySelector('.auth__form div').classList.value;

  let isFormValid = true;

  button.addEventListener('click', () => {
    isFormValid = true;
    formFields.forEach((field) => {
      if (!isValid(field.value, field.type)) isFormValid = false;
    });
    if (isFormValid) {
      send(formName);
    } else {
      formFields.forEach((field) => validate(field.value, field.type, field.id));
    }
  });
};

export default sendForm;
