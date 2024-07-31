

export class Renderer {
  private canvas: HTMLCanvasElement;
  public GL: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("webgl2");

    if (!ctx) {
      alert("WebGL2 not supported, such a shame!");
      throw new Error("WebGL2 not supported, such a shame!");
    }

    this.GL = ctx;

    this.resize(window.innerWidth, window.innerHeight);
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.GL.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  public render(time: number) {
    this.GL.clearColor(0.1, 0, 0, 1);
    this.GL.clear(this.GL.COLOR_BUFFER_BIT);
    this.GL.clearDepth(1.0);
  }
}
