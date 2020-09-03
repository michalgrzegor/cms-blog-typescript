export default class ImageLoader {
  private imageSRC: string;
  private container: HTMLElement;

  constructor(imageSRC: string, container: HTMLElement) {
    this.imageSRC = imageSRC;
    this.container = container;
  }

  private loadImage(image: HTMLImageElement) {
    this.container.querySelector<HTMLElement>('.image__loader').style.display = 'none';
    this.container.querySelector('img').style.display = 'block';
    this.container.querySelector('img').src = image.src;
  }

  private imageLoaderPromise(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = this.imageSRC;
    });
  }

  imageLoader() {
    this.imageLoaderPromise().then((image) => this.loadImage(image));
  }
}
