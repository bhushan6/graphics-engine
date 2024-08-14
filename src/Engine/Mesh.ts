import { Geometry, Material } from ".";
import { Object3D } from "./Object3D";

export class Mesh extends Object3D {
  private _geometry: Geometry;
  private _material: Material;

  constructor(geometry: Geometry, material: Material) {
    super();
    this._geometry = geometry;
    this._material = material;
  }

  get geometry() {
    return this._geometry;
  }

  get material() {
    return this._material;
  }
}
