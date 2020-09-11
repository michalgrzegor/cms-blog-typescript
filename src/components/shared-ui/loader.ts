export default class Loader {
  private loader: HTMLDivElement;

  constructor() {
    this.loader = this.createLoader();
  }

  private createLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    return loader;
  }

  showLoader = (parrent: Element) => {
    parrent.appendChild(this.loader);
  };

  removeLoader = () => {
    this.loader.remove();
  };
}
