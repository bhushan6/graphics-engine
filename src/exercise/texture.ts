import { createGLContext, createProgram } from "./utils";

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
in vec2 uv;

out vec2 vUV;

void main() {
    vUV = uv;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es  
    precision highp float;

    in vec2 vUV;

    out vec4 fragColor;

    uniform sampler2D uSampler;

    void main() {
        fragColor = texture(uSampler, vUV);
    }
`;

const gl = createGLContext();

gl.clearColor(1, 1, 1, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const positionData = new Float32Array([0.0, 0.0, 0.0, 0.5, 0.5, 0.0]);

const positionAttribLocation = gl.getAttribLocation(program, "aPosition");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

gl.vertexAttribPointer(
  positionAttribLocation,
  2,
  gl.FLOAT,
  false,
  4 * 2,
  0 * 4
);

gl.enableVertexAttribArray(positionAttribLocation);

const uvData = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0]);
const uvAttribLocation = gl.getAttribLocation(program, "uv");

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);

gl.vertexAttribPointer(uvAttribLocation, 2, gl.FLOAT, false, 4 * 2, 0 * 4);

gl.enableVertexAttribArray(uvAttribLocation);

//texture
const pixelData = new Uint8Array([
  255, 0, 0,

  255, 0, 255,

  0, 255, 0,

  0, 255, 255,

  255, 255, 255,

  255, 0, 0,

  255, 0, 255,

  0, 255, 0,

  0, 255, 255,

  255, 255, 255,

  255, 0, 0,

  255, 0, 255,

  0, 255, 0,

  0, 255, 255,

  255, 255, 255,

  255, 0, 0,
]);

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGB,
  4,
  4,
  0,
  gl.RGB,
  gl.UNSIGNED_BYTE,
  pixelData
);

gl.generateMipmap(gl.TEXTURE_2D);

gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

gl.drawArrays(gl.TRIANGLES, 0, 3);
