type AttributesType = {
  [key: string]: {
    data: Float32Array | Uint16Array;
    size: number;
    offset: number;
  };
};

export class Geometry {
  private _attributes: AttributesType;
  private GL: WebGL2RenderingContext;
  private _indices: Uint16Array;

  public get attributes() {
    return this._attributes;
  }

  constructor(
    gl: WebGL2RenderingContext,
    attributes: AttributesType,
    indices: Uint16Array
  ) {
    this._attributes = attributes;
    this.GL = gl;
    this._indices = indices;
  }

  private createBuffer = (name: string, data: Float32Array | Uint16Array) => {
    const buffer = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, buffer);
    this.GL.bufferData(this.GL.ARRAY_BUFFER, data, this.GL.STATIC_DRAW);
    return buffer;
  };

  private bindBuffer = (
    program: WebGLProgram,
    name: string,
    buffer: WebGLBuffer,
    size: number
  ) => {
    const location = this.GL.getAttribLocation(program, name);
    this.GL.bindBuffer(this.GL.ARRAY_BUFFER, buffer);
    this.GL.vertexAttribPointer(location, size, this.GL.FLOAT, false, 0, 0);
    this.GL.enableVertexAttribArray(location);
  };

  public bindBuffers = (program: WebGLProgram) => {
    this.GL.useProgram(program);
    Object.keys(this._attributes).forEach((bufferName) => {
      const data = this._attributes[bufferName].data;
      const buffer = this.createBuffer(bufferName, data);
      if (!buffer) {
        throw new Error("Could not create buffer");
      }
      this.bindBuffer(
        program,
        bufferName,
        buffer,
        this._attributes[bufferName].size
      );
    });
  };

  public addIndices = () => {
    const data = this._indices;
    const buffer = this.GL.createBuffer();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, buffer);
    this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, data, this.GL.STATIC_DRAW);
  };

  public draw = () => {
    this.GL.drawArrays(this.GL.TRIANGLES, 0, this._indices.length);
  };
}
