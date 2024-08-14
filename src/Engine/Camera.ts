import { mat4 } from "gl-matrix";
import { Object3D } from "./Object3D";

export class Camera extends Object3D {
  private _fov: number;
  private _near: number;
  private _far: number;
  private _aspect: number;

  public projectionMatrix = mat4.create();

  public updateCameraMatrix() {
    this.updateMatrix();
    mat4.perspective(
      this.projectionMatrix,
      this._fov,
      this._aspect,
      this._near,
      this._far
    );
  }

  constructor({
    fov,
    aspect,
    near,
    far,
  }: {
    fov: number;
    aspect: number;
    near: number;
    far: number;
  }) {
    super();
    this._fov = fov;
    this._near = near;
    this._far = far;
    this._aspect = aspect;
    this.updateCameraMatrix();
  }

  set aspect(value: number) {
    this._aspect = value;
  }
}
