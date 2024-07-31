import "../style.css";
import { createGLContext, createProgram } from "./utils";

const gl = createGLContext();

gl.clearColor(0.1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

const program = createProgram(
  gl,
  `#version 300 es

  in vec2 uPosition;
  in float uSize;
  in vec3 uColor;

  out vec3 vColor;

void main() {
    vColor = uColor;
  gl_Position = vec4(uPosition, 0.0, 1.0);
  gl_PointSize = uSize;
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

const positionUniformLocation = gl.getAttribLocation(program, "uPosition");
const sizeUniformLocation = gl.getAttribLocation(program, "uSize");
const colorUniformLocation = gl.getAttribLocation(program, "uColor");

gl.vertexAttrib2f(positionUniformLocation, 0, 0);
gl.vertexAttrib1f(sizeUniformLocation, 150);
gl.vertexAttrib3f(colorUniformLocation, 1, 0, 1);

gl.drawArrays(gl.POINTS, 0, 1);
