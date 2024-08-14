import "../style.css";
import { createGLContext, createProgram } from "./utils";

const gl = createGLContext();

// STEPS TO CREATE A SHADER :
// Create Shader Object
// Set Shader Source
// Compile Shader
// Attach Shader to Program
// Link Program
// Check if Shader is linked

createProgram(
  gl,
  `#version 300 es

void main() {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 150.0;
}
`,
  `#version 300 es

precision highp float;
out vec4 fragColor;
void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
);

gl.drawArrays(gl.POINTS, 0, 1);
