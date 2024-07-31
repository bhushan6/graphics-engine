const vertexShaderCode = `#version 300 es
    
	in vec2 vertPos;
    in vec3 aColor;

    out vec3 vColor;

	void main(){
        vColor=aColor;
  	    gl_Position=vec4(vertPos,0.0,1.0);
	}
`;

const fragmentShaderCode = `#version 300 es
	precision highp float;
	out vec4 fragColor;

    in vec3 vColor;
    
	void main(){
  	  fragColor=vec4(vColor,1.0);
	}
`;

export class Material {
  private _program: WebGLProgram;
  private GL: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.GL = gl;
    this._program = this.createProgram();
  }

  public bind = () => {
    this.GL.useProgram(this._program);
  };

  private createProgram = () => {
    const vertexShader = this.GL.createShader(this.GL.VERTEX_SHADER);
    if (!vertexShader) {
      throw new Error("Vertex shader not created");
    }
    this.GL.shaderSource(vertexShader, vertexShaderCode);
    this.GL.compileShader(vertexShader);

    const fragmentShader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
    if (!fragmentShader) {
      throw new Error("Fragment shader not created");
    }

    this.GL.shaderSource(fragmentShader, fragmentShaderCode);
    this.GL.compileShader(fragmentShader);
    const program = this.GL.createProgram();
    if (!program) {
      throw new Error("Program not created");
    }
    this.GL.attachShader(program, vertexShader);
    this.GL.attachShader(program, fragmentShader);
    this.GL.linkProgram(program);
    return program;
  };

  public get program() {
    return this._program;
  }
}
