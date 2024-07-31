import { Geometry, Material } from ".";

export class Mesh {
  private _geometry: Geometry;
  private _material: Material;

  constructor(geometry: Geometry, material: Material) {
    this._geometry = geometry;
    this._material = material;
    this._geometry.addIndices();
    this._geometry.bindBuffers(this._material.program);
  }

  public draw() {
    this._geometry.bindBuffers(this._material.program);
    this._geometry.draw();
  }
}
