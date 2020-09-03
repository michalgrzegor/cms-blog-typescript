const loadImage = (image: HTMLImageElement, container: HTMLElement) => {
  (container.querySelector('.image__loader') as HTMLElement).style.display = 'none';
  container.querySelector('img').style.display = 'block';
  container.querySelector('img').src = image.src;
};

const imageLoaderPromise = (imageSRC: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSRC;
  });
};

const imageLoader = (imageSRC: string, container: HTMLElement) => {
  imageLoaderPromise(imageSRC).then((image) => loadImage(image, container));
};

export default imageLoader;
