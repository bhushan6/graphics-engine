import { Mesh, Renderer } from ".";

export class Scene {
  private renderer: Renderer;

  private meshes: Mesh[] = [];

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  public add(mesh: Mesh) {
    this.meshes.push(mesh);
  }

  public remove(mesh: Mesh) {
    this.meshes = this.meshes.filter((m) => m !== mesh);
  }

  public render() {
    this.meshes.forEach((mesh) => {
      mesh.draw();
    });
  }
}
