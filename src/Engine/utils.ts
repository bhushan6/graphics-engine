export const getBoxGeometryData = () => {
  return {
    position: {
      size: 3,
      data: new Float32Array([
        0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
        0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5,
        0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
      ]),
    },
    normal: {
      size: 3,
      data: new Float32Array([
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0,
        1, 0, 0, 1,
      ]),
    },
    uv: {
      size: 2,
      data: new Float32Array([
        0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0,
        0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0,
      ]),
    },
    index: {
      size: 1,
      data: new Uint8Array([
        0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14,
        15, 13, 16, 18, 17, 18, 19, 17, 20, 22, 21, 22, 23, 21,
      ]),
    },
  };
};

export const getPlaneGeometryData = () => {
  return {
    position: {
      size: 3,
      data: new Float32Array([
        0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0, -0.5, 0.5, 0,
      ]),
    },
    normal: {
      size: 3,
      data: new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]),
    },
    uv: {
      size: 2,
      data: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
    },
    index: {
      size: 1,
      data: new Uint8Array([0, 1, 2, 0, 2, 3]),
    },
  };
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
