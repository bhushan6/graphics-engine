const loadImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      console.log("image load error", url);
      reject(null);
    };
    image.src = url;
  });
};

export class Texture {
  public data: HTMLImageElement | null = null;

  constructor(url: string) {
    loadImage(url)
      .then((image) => {
        this.data = image;
      })
      .catch(() => {
        throw new Error("texture load error");
      });
  }

  public flipY = false;
}
