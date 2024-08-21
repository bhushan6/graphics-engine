import { Texture } from ".";

export type UniformType = number | number[] | Float32Array | Texture | null;
export class Material {
  public uniforms: { [key: string]: { value: UniformType } };
  private _vertexShader: string;
  private _fragmentShader: string;

  public needsUpdate = true;

  constructor({
    uniforms,
    vertexShader,
    fragmentShader,
  }: {
    vertexShader: string;
    fragmentShader: string;
    uniforms: { [key: string]: UniformType };
  }) {
    this.uniforms = {
      modelMatrix: { value: null },
      viewMatrix: { value: null },
      projectionMatrix: { value: null },
    };
    Object.keys(uniforms).forEach((uniformName) => {
      this.uniforms[uniformName] = { value: uniforms[uniformName] };
    });
    this._vertexShader = vertexShader;
    this._fragmentShader = fragmentShader;
  }

  get vertexShader() {
    return this._vertexShader;
  }
  get fragmentShader() {
    return this._fragmentShader;
  }
}
