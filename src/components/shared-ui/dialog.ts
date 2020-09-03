export default class OpenDialog {
  acceptFunction: Function;
  declineFunction: Function;

  closeDialog() {
    document.querySelector('.dialog__bg').remove();
  }

  accept() {
    this.acceptFunction();
    this.closeDialog();
  }

  decline() {
    this.declineFunction();
    this.closeDialog();
  }

  createDialog(acceptFunction: Function, declineFunction: Function, dialogText: string) {
    this.acceptFunction = acceptFunction;
    this.declineFunction = declineFunction;
    const container = document.createElement('div');
    const dialogContainer = document.createElement('div');
    const paragraph = document.createElement('p');
    const acceptButton = document.createElement('button');
    const declineButton = document.createElement('button');
    container.classList.add('dialog__bg');
    dialogContainer.classList.add('dialog__container');
    acceptButton.addEventListener('click', () => this.accept());
    declineButton.addEventListener('click', () => this.decline());
    paragraph.textContent = dialogText;
    acceptButton.textContent = 'yes';
    declineButton.textContent = 'no';
    dialogContainer.appendChild(paragraph);
    dialogContainer.appendChild(acceptButton);
    dialogContainer.appendChild(declineButton);
    container.appendChild(dialogContainer);
    document.body.appendChild(container);
  }
}
