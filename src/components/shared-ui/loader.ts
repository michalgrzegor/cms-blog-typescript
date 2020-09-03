export default class Loader {
  createLoader = (parrent: Element) => {
    const loader = document.createElement('div');
    loader.id = 'loader';
    parrent.appendChild(loader);
  };

  removeLoader = () => {
    const loader = document.querySelector('#loader');
    loader.remove();
  };
}
