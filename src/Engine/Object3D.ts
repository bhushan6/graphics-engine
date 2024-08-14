import { mat4, quat, vec3, vec4 } from "gl-matrix";

export class Object3D {
  private _rotation = quat.fromValues(0, 0, 0, 1);
  private _position: vec3 = vec3.create();
  private _scale: vec3 = vec3.fromValues(1, 1, 1);

  private _matrix = mat4.create();

  readonly up = vec3.fromValues(0, 1, 0);

  public updateMatrix() {
    mat4.fromRotationTranslationScale(
      this._matrix,
      this._rotation,
      this._position,
      this._scale
    );
  }

  constructor() {
    this.updateMatrix();
  }

  public set position({ x, y, z }: { x: number; y: number; z: number }) {
    this._position[0] = x;
    this._position[1] = y;
    this._position[2] = z;
    this.updateMatrix();
  }

  public get position(): vec3 {
    return this._position;
  }

  public set rotation({
    x,
    y,
    z,
    w,
  }: {
    x: number;
    y: number;
    z: number;
    w: number;
  }) {
    this._rotation[0] = x;
    this._rotation[1] = y;
    this._rotation[2] = z;
    this._rotation[3] = w;
    this.updateMatrix();
  }

  public get rotation(): vec4 {
    return this._rotation;
  }

  public set scale({ x, y, z }: { x: number; y: number; z: number }) {
    this._scale[0] = x;
    this._scale[1] = y;
    this._scale[2] = z;
    this.updateMatrix();
  }

  public get scale(): vec3 {
    return this._scale;
  }

  public get matrix(): mat4 {
    // mat4.fromRotationTranslationScale(
    //   this._matrix,
    //   this._rotation,
    //   this._position,
    //   this._scale
    // );
    return this._matrix;
  }
}
