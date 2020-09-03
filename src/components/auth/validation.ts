export const renderError = (message: string, id: string) => {
  const paragraph = document.createElement('p');
  paragraph.classList.add('error', `error_${id}`);
  const container = document.querySelector(`#${id}`).parentNode;
  paragraph.innerHTML = message;
  container.appendChild(paragraph);
};

export const removeError = (id: string) => {
  const paragraph = document.querySelector(`.error_${id}`);
  if (paragraph) paragraph.remove();
};

export const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validate = (value: string, type: string, id: string) => {
  if (type === 'text' && value === '') {
    removeError(id);
    renderError('This field is required', id);
  } else if (type === 'password' && value.length < 6) {
    removeError(id);
    renderError('Password is too short', id);
  } else if (type === 'email' && (value === '' || !validateEmail(value))) {
    removeError(id);
    renderError('Please enter a valid email address', id);
  } else {
    removeError(id);
  }
};

export const isValid = (value: string, type: string) => {
  return !(
    (type === 'text' && value === '') ||
    (type === 'password' && value.length < 6) ||
    (type === 'email' && (value === '' || !validateEmail(value)))
  );
};
