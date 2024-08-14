import { createGLContext, createProgram } from "./utils";

const vertexShaderSource = `#version 300 es
    in vec2 aPosition;

    in vec2 aOffset;
    in float aScale;

    in vec2 aColor;

    out vec2 vColor;

    void main(){
        vColor = aColor;
        gl_Position = vec4((aPosition + aOffset) * aScale, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `#version 300 es

    precision highp float;

    in vec2 vColor;

    out vec4 fragColor;

    void main(){
        fragColor = vec4(vColor, 0.0, 1.0);  
    }
`;

const gl = createGLContext();

gl.clearColor(1.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const positionBufferData = new Float32Array([
  0.0, 0.0,

  0.5, 0.5,

  0.5, -0.5,
]);

const positionBuffer = gl.createBuffer();

const vao = gl.createVertexArray();
gl.bindVertexArray(vao)

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionBufferData, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, "aPosition");

gl.vertexAttribPointer(
  positionAttribLocation,
  2,
  gl.FLOAT,
  false,
  2 * 4,
  0 * 4
);
gl.enableVertexAttribArray(positionAttribLocation);

const transformData = new Float32Array([
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0,

  -0.6, 0, 0.4, 0.0, 1.0, 0.0,
]);

const transformBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW);

const offsetAttribLocation = gl.getAttribLocation(program, "aOffset");
const scaleAttribLocation = gl.getAttribLocation(program, "aScale");
const colorAttribLocation = gl.getAttribLocation(program, "aColor");

gl.vertexAttribPointer(offsetAttribLocation, 2, gl.FLOAT, false, 6 * 4, 0 * 4);
gl.vertexAttribPointer(scaleAttribLocation, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

gl.vertexAttribDivisor(offsetAttribLocation, 1);
gl.vertexAttribDivisor(scaleAttribLocation, 1);
gl.vertexAttribDivisor(colorAttribLocation, 1);

gl.enableVertexAttribArray(offsetAttribLocation);
gl.enableVertexAttribArray(scaleAttribLocation);
gl.enableVertexAttribArray(colorAttribLocation);

gl.bindVertexArray(null)
// gl.vertexAttribPointer(offsetAttribLocation, 2, )

gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 2);

const render = () => {
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.bindVertexArray(vao);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 2);

  requestAnimationFrame(render);
};

render();
