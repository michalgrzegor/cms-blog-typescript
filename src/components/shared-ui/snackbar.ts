export default class SnackBar {
  private snackBarContainer: HTMLDivElement;
  private timer: number;

  constructor() {
    this.snackBarContainer = this.createSnackBar();
  }

  private createRemoveButton(): HTMLButtonElement {
    const removeButton: HTMLButtonElement = document.createElement('button');
    removeButton.addEventListener('click', () => this.removeSnackBar());
    return removeButton;
  }

  private createSnackBar(): HTMLDivElement {
    const snackBarContainer: HTMLDivElement = document.createElement('div');
    const paragraph: HTMLParagraphElement = document.createElement('p');
    snackBarContainer.classList.add('snackbar');
    snackBarContainer.appendChild(paragraph);
    snackBarContainer.appendChild(this.createRemoveButton());
    return snackBarContainer;
  }

  private removeSnackBar(): void {
    window.clearTimeout(this.timer);
    this.snackBarContainer.remove();
  }

  showSnackBar(message: string): void {
    this.snackBarContainer.querySelector('p').textContent = message;
    document.body.appendChild(this.snackBarContainer);
    this.timer = window.setTimeout(() => this.removeSnackBar(), 5000);
  }
}
