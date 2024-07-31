import "../style.css";
import { createGLContext, createProgram } from "./utils";

const gl = createGLContext();

gl.clearColor(0.1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

const program = createProgram(
  gl,
  `#version 300 es

  uniform vec2 uPosition;
  uniform float uSize;

void main() {
  gl_Position = vec4(uPosition, 0.0, 1.0);
  gl_PointSize = uSize;
}
`,
  `#version 300 es

precision highp float;

uniform vec3 uColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(uColor, 1.0);
}
`
);

const positionUniformLocation = gl.getUniformLocation(program, "uPosition");
const sizeUniformLocation = gl.getUniformLocation(program, "uSize");
const colorUniformLocation = gl.getUniformLocation(program, "uColor");

gl.uniform2f(positionUniformLocation, 0, 0);
gl.uniform1f(sizeUniformLocation, 150);
gl.uniform3f(colorUniformLocation, 1, 0, 1);

gl.drawArrays(gl.POINTS, 0, 1);
