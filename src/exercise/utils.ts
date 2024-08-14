export const resizeCanvas = () => {
  const canvas = document.getElementById("webglCanvas") as HTMLCanvasElement;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  return canvas;
};

export const createGLContext = () => {
  const canvas = resizeCanvas();

  // HTML Canvas
  // WebGl2 Context
  // Vertex and Fragment Shader

  const gl = canvas.getContext("webgl2");

  if (!gl) {
    alert("WebGL2 not supported, such a shame!");
    throw new Error("WebGL2 not supported, such a shame!");
  }
  return gl;
};

export const createShader = (
  gl: WebGL2RenderingContext,
  shader: string,
  type: "vertex" | "fragment"
) => {
  const shaderObject = gl.createShader(
    type === "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
  );
  if (!shaderObject) {
    throw new Error("Shader not created");
  }
  gl.shaderSource(shaderObject, shader);
  gl.compileShader(shaderObject);

  return shaderObject;
};

export const createProgram = (
  gl: WebGL2RenderingContext,
  vertexShader: string,
  fragmentShader: string
) => {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Program not created");
  }
  const vertexShaderObject = createShader(gl, vertexShader, "vertex");
  const fragmentShaderObject = createShader(gl, fragmentShader, "fragment");
  gl.attachShader(program, vertexShaderObject);
  gl.attachShader(program, fragmentShaderObject);

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.log(gl.getProgramInfoLog(program));
    console.log(gl.getShaderInfoLog(vertexShaderObject));
    console.log(gl.getShaderInfoLog(fragmentShaderObject));
    throw new Error("Could not link program");
  }
  return program;
};

export const createAttribute = (
  gl: WebGL2RenderingContext,
  {
    buffer,
    bufferData,
    location,
    size,
    strideInBytes,
    offsetInBytes,
  }: {
    buffer: WebGLBuffer;
    bufferData: Float32Array;
    location: number;
    size: number;
    strideInBytes: number;
    offsetInBytes: number;
  }
) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

  gl.vertexAttribPointer(
    location,
    size,
    gl.FLOAT,
    false,
    strideInBytes,
    offsetInBytes
  );
  gl.enableVertexAttribArray(location);

  return () => {
    createAttribute(gl, {
      buffer,
      bufferData,
      location,
      size,
      strideInBytes,
      offsetInBytes,
    });
  };
};
