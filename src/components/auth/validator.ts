export default class Validator {
  renderError({ message, id }: { message: string; id: string }): void {
    const paragraph: HTMLParagraphElement = document.createElement('p');
    paragraph.classList.add('error', `error_${id}`);
    const container = document.querySelector(`#${id}`).parentNode;
    paragraph.innerHTML = message;
    container.appendChild(paragraph);
  }

  removeError({ id }: { id: string }): void {
    const paragraph = document.querySelector(`.error_${id}`);
    if (paragraph) paragraph.remove();
  }

  validateEmail(email: string): boolean {
    const re: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validate({ value, type, id }: { value: string; type: string; id: string }): void {
    if (type === 'text' && !this.isValid({ value: value, type: type })) {
      this.removeError({ id: id });
      this.renderError({ message: 'This field is required', id: id });
    } else if (type === 'password' && !this.isValid({ value: value, type: type })) {
      this.removeError({ id: id });
      this.renderError({ message: 'Password is too short', id: id });
    } else if (type === 'email' && !this.isValid({ value: value, type: type })) {
      this.removeError({ id: id });
      this.renderError({ message: 'Please enter a valid email address', id: id });
    } else {
      this.removeError({ id: id });
    }
  }

  isValid({ value, type }: { value: string; type: string }): boolean {
    return !(
      (type === 'text' && value === '') ||
      (type === 'password' && value.length < 6) ||
      (type === 'email' && (value === '' || !this.validateEmail(value)))
    );
  }
}
