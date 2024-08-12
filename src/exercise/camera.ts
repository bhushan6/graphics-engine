import { createGLContext, createProgram } from "./utils";
import { mat4 } from "gl-matrix";

// Model => View => Projection
// Multiplication from Right to Left

const vertexShaderSource = `#version 300 es

    in vec3 aPosition;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;

    in vec3 aColor;
    out vec3 vColor;

    void main() {
        vColor = aColor;
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
    }
`;

const fragmentShaderSource = `#version 300 es
    precision highp float;

    in vec3 vColor;

    out vec4 fragColor;

    void main(){
        fragColor = vec4(vColor, 1.0);
    }
`;

const gl = createGLContext();

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const vertexData = new Float32Array([
  -0.5, -0.5, -0.5, 0, 1, 1, -0.5, 0.5, 0.5, 0, 1, 1, -0.5, 0.5, -0.5, 0, 1, 1,
  -0.5, -0.5, 0.5, 0, 1, 1, -0.5, 0.5, 0.5, 0, 1, 1, -0.5, -0.5, -0.5, 0, 1, 1,

  0.5, -0.5, -0.5, 1, 0, 1, 0.5, 0.5, -0.5, 1, 0, 1, 0.5, 0.5, 0.5, 1, 0, 1,
  0.5, 0.5, 0.5, 1, 0, 1, 0.5, -0.5, 0.5, 1, 0, 1, 0.5, -0.5, -0.5, 1, 0, 1,

  -0.5, -0.5, -0.5, 0, 1, 0, 0.5, -0.5, -0.5, 0, 1, 0, 0.5, -0.5, 0.5, 0, 1, 0,
  0.5, -0.5, 0.5, 0, 1, 0, -0.5, -0.5, 0.5, 0, 1, 0, -0.5, -0.5, -0.5, 0, 1, 0,

  -0.5, 0.5, -0.5, 1, 1, 0, 0.5, 0.5, 0.5, 1, 1, 0, 0.5, 0.5, -0.5, 1, 1, 0,
  -0.5, 0.5, 0.5, 1, 1, 0, 0.5, 0.5, 0.5, 1, 1, 0, -0.5, 0.5, -0.5, 1, 1, 0,

  0.5, -0.5, -0.5, 0, 0, 1, -0.5, -0.5, -0.5, 0, 0, 1, 0.5, 0.5, -0.5, 0, 0, 1,
  -0.5, 0.5, -0.5, 0, 0, 1, 0.5, 0.5, -0.5, 0, 0, 1, -0.5, -0.5, -0.5, 0, 0, 1,

  -0.5, -0.5, 0.5, 1, 0, 0, 0.5, -0.5, 0.5, 1, 0, 0, 0.5, 0.5, 0.5, 1, 0, 0,
  0.5, 0.5, 0.5, 1, 0, 0, -0.5, 0.5, 0.5, 1, 0, 0, -0.5, -0.5, 0.5, 1, 0, 0,
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
const colorAttribLocation = gl.getAttribLocation(program, "aColor");

gl.vertexAttribPointer(
  positionAttribLocation,
  3,
  gl.FLOAT,
  false,
  6 * 4,
  0 * 4
);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

gl.enableVertexAttribArray(positionAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

const modelUniformLocation = gl.getUniformLocation(program, "modelMatrix");
const viewUniformLocation = gl.getUniformLocation(program, "viewMatrix");
const projectionUniformLocation = gl.getUniformLocation(
  program,
  "projectionMatrix"
);

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

// mat4.rotateY(modelMatrix, modelMatrix, 0.4);
// mat4.rotateX(modelMatrix, modelMatrix, 0.4);

mat4.lookAt(viewMatrix, [2.6, 2.6, 2.6], [0, 0, 0], [0, 1, 0])

mat4.perspective(projectionMatrix, Math.PI/6, gl.canvas.width/gl.canvas.height, 0.1, 100)

gl.uniformMatrix4fv(modelUniformLocation, false, modelMatrix);
gl.uniformMatrix4fv(viewUniformLocation, false, viewMatrix);
gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);

gl.drawArrays(gl.TRIANGLES, 0, 36);

const render = () => {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  mat4.rotateY(modelMatrix, modelMatrix, 0.04);
  mat4.rotateX(modelMatrix, modelMatrix, -0.02);
  mat4.rotateZ(modelMatrix, modelMatrix, 0.02);
  
  gl.uniformMatrix4fv(modelUniformLocation, false, modelMatrix);
  gl.uniformMatrix4fv(viewUniformLocation, false, viewMatrix);
  gl.uniformMatrix4fv(projectionUniformLocation, false, projectionMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, 36);

  requestAnimationFrame(render);
};

render();
