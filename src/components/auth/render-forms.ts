import authMediator from './auth-mediator';

export default class RenderForms {
  private container: HTMLElement;
  private formName: string;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  private send() {
    if (this.formName === 'form__signup') {
      authMediator.handleRequest('signup').then((r) => r.signup());
    } else if (this.formName === 'form__reset') {
      authMediator.handleRequest('reset').then((r) => r.reset());
    }
  }

  private createFormFuncionality() {
    const button: HTMLButtonElement = this.container.querySelector('form button');
    const formFields: NodeListOf<HTMLInputElement> = this.container.querySelectorAll('input');

    button.addEventListener('click', () => {
      const promises: Promise<boolean>[] = [];
      formFields.forEach((field: HTMLInputElement) => {
        promises.push(
          authMediator.handleRequest('is valid', { value: field.value, type: field.type })
        );
      });
      Promise.all(promises).then((v) => {
        if (v.includes(false)) {
          formFields.forEach((field: HTMLInputElement) =>
            authMediator.handleRequest('validate', {
              value: field.value,
              type: field.type,
              id: field.id,
            })
          );
        } else {
          this.send();
        }
      });
    });
  }

  private switchAction(event: Event) {
    if ((<HTMLButtonElement>event.target).type === 'button')
      this.renderForm((<HTMLButtonElement>event.target).getAttribute('switchTo'));
  }

  private switchForm() {
    const switchContainer: HTMLButtonElement = this.container.querySelector('.form__switchbtn');
    switchContainer.addEventListener('click', (e) => this.switchAction(e));
  }

  private getTemplate(): HTMLDivElement {
    return document
      .querySelector<HTMLTemplateElement>(`#${this.formName}`)
      .content.cloneNode(true) as HTMLDivElement;
  }

  renderForm(formName: string) {
    this.formName = formName;
    if (this.formName === 'form__login') {
      authMediator.handleRequest('login');
    } else {
      this.container.innerHTML = '';
      const template: HTMLDivElement = this.getTemplate();
      const inputs: NodeListOf<HTMLInputElement> = template.querySelectorAll('input');
      inputs.forEach((input: HTMLInputElement) => {
        input.addEventListener('blur', () => {
          authMediator.handleRequest('validate', {
            value: input.value,
            type: input.type,
            id: input.id,
          });
        });
        input.addEventListener('focus', () => {
          authMediator.handleRequest('remove error', { id: input.id });
        });
      });
      this.container.appendChild(template);
      this.createFormFuncionality();
      this.switchForm();
    }
  }
}
