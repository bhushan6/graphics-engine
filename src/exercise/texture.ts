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

gl.vertexAttribPointer(
  uvAttribLocation,
  2,
  gl.FLOAT,
  false,
  4 * 2,
  0 * 4
);

gl.enableVertexAttribArray(uvAttribLocation);

gl.drawArrays(gl.TRIANGLES, 0, 3);
