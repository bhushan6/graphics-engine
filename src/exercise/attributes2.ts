import "../style.css";
import { createGLContext, createProgram } from "./utils";

const gl = createGLContext();

gl.clearColor(0.1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

const program = createProgram(
  gl,
  `#version 300 es

  in vec2 aPosition;
  in float aSize;
  in vec3 aColor;

  out vec3 vColor;

void main() {
    vColor = aColor;
  gl_Position = vec4(aPosition, 0.0, 1.0);
  gl_PointSize = aSize;
}
`,
  `#version 300 es

precision highp float;

in vec3 vColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(vColor, 1.0);
}
`
);

const positionBufferData = new Float32Array([
  0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5, -0.5,
]);

const sizeBufferData = new Float32Array([100, 10, 150, 50, 30]);

const colorBufferData = new Float32Array([
  1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1,
]);

const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
const sizeAttribLocation = gl.getAttribLocation(program, "aSize");
const colorAttribLocation = gl.getAttribLocation(program, "aColor");

gl.vertexAttrib2f(positionAttribLocation, 0, 0);
gl.vertexAttrib1f(sizeAttribLocation, 150);
gl.vertexAttrib3f(colorAttribLocation, 1, 0, 1);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionBufferData, gl.STATIC_DRAW);

const sizeBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
gl.bufferData(gl.ARRAY_BUFFER, sizeBufferData, gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 2 * 4, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
gl.vertexAttribPointer(sizeAttribLocation, 1, gl.FLOAT, false, 1 * 4, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 3 * 4, 0);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(sizeAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

//CHANGING ATTRIBUTE AFTER PASSING
// colorBufferData[1] = 1
// gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);

gl.drawArrays(gl.POINTS, 0, 5);
