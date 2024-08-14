type UniformType = number | number[] | Float32Array;
export class Material {
  public uniforms: { [key: string]: UniformType };
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
    this.uniforms = uniforms;
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
