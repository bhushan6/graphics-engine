import { Mesh } from ".";

export class Scene {

  private _meshes: Mesh[] = [];

  constructor() {}

  public add(mesh: Mesh) {
    this._meshes.push(mesh);
  }

  public remove(mesh: Mesh) {
    this._meshes = this._meshes.filter((m) => m !== mesh);
  }

  public get meshes() {
    return this._meshes;
  }

  public render() {}
}
