import { createGLContext, createProgram } from "./utils";

const vertexShaderSource = `#version 300 es
in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {
  vColor = aColor;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
    precision highp float;

    in vec3 vColor;

    out vec4 fragColor;

    void main() {
        fragColor = vec4(vColor, 1.0);
    }  
`;

const gl = createGLContext();

gl.clearColor(0.1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const arrayVertexData = new Float32Array([
  0, 0, 0.0, 1.0, 0.95106, 0.30902,

  0, 0, 0.95106, 0.30902, 0.58779, -0.80902,

  0, 0, 0.58779, -0.80902, -0.58779, -0.80902,

  0, 0, -0.58779, -0.80902, -0.95106, 0.30902,

  0, 0, -0.95106, 0.30902, 0.0, 1.0,
]);

const uniqueVertexData = new Float32Array([
    0, 0, 
    0.0, 1.0, 
    0.95106, 0.30902,
    -0.95106, 0.30902,
    -0.58779, -0.80902,
    0.58779, -0.80902
]);

const indexData = new Uint8Array([
    0, 1, 2,
    
    0, 3, 1,

    0, 4, 3,

    0, 5, 4,

    0, 2, 5
])

const positionAttribLocation = gl.getAttribLocation(program, "aPosition");
const colorAttribLocation = gl.getAttribLocation(program, "aColor");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, uniqueVertexData, gl.STATIC_DRAW);

gl.vertexAttribPointer(
  positionAttribLocation,
  2,
  gl.FLOAT,
  false,
  4 * 2,
  0 * 4
);
gl.vertexAttrib3f(colorAttribLocation, 1, 0, 1);
gl.enableVertexAttribArray(positionAttribLocation);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);



// gl.drawArrays(gl.TRIANGLES, 0, 15);
gl.drawElements(gl.TRIANGLES, 15, gl.UNSIGNED_BYTE, 0)
