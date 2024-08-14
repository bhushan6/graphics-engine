import { createGLContext, createProgram } from "./utils";

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main () {
    vColor = aColor;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
    precision highp float;

    out vec4 fragColor;

    in vec3 vColor;

    void main() {
        fragColor = vec4(vColor, 1.0);
    }
`;

const gl = createGLContext();

gl.clearColor(1, 1, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

//  1st triangle

const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

const positionData = new Float32Array([
  0.0, 0.0,

  0.5, 0.5,

  0.5, -0.5,
]);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);

const vao1 = gl.createVertexArray();
gl.bindVertexArray(vao1);

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

const colorData = new Float32Array([1, 1, 1, 0, 0, 0, 1, 0, 1]);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.DYNAMIC_DRAW);

const colorAttribLocation = gl.getAttribLocation(program, "aColor");
gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 3 * 4, 0 * 4);
gl.enableVertexAttribArray(colorAttribLocation);

gl.bindVertexArray(null);

gl.drawArrays(gl.TRIANGLES, 0, 3);

// 2nd triangle

const program2 = createProgram(gl, vertexShaderSource, fragmentShaderSource);
const positionData2 = new Float32Array([
  0.0, 0.0,

  -0.5, -0.5,

  -0.5, 0.5,
]);

const positionBuffer2 = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, positionData2, gl.STATIC_DRAW);

const vao2 = gl.createVertexArray();
gl.bindVertexArray(vao2);

const positionAttribLocation2 = gl.getAttribLocation(program2, "aPosition");

gl.vertexAttribPointer(
  positionAttribLocation2,
  2,
  gl.FLOAT,
  false,
  2 * 4,
  0 * 4
);
gl.enableVertexAttribArray(positionAttribLocation);

const colorData2 = new Float32Array([0, 0, 1, 0, 1, 0, 1, 0, 1]);

const colorBuffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
gl.bufferData(gl.ARRAY_BUFFER, colorData2, gl.DYNAMIC_DRAW);

const colorAttribLocation2 = gl.getAttribLocation(program, "aColor");
gl.vertexAttribPointer(colorAttribLocation2, 3, gl.FLOAT, false, 3 * 4, 0 * 4);
gl.enableVertexAttribArray(colorAttribLocation2);

gl.bindVertexArray(null);

gl.drawArrays(gl.TRIANGLES, 0, 3);

let t = 0;

const animate = () => {
  gl.clearColor(1, 1, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clearDepth(1.0);

  //1st triangle
  //   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  //   gl.vertexAttribPointer(
  //     positionAttribLocation,
  //     2,
  //     gl.FLOAT,
  //     false,
  //     2 * 4,
  //     0 * 4
  //   );
  //   gl.enableVertexAttribArray(positionAttribLocation);

  //   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  //   gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 3 * 4, 0 * 4);
  //   gl.enableVertexAttribArray(colorAttribLocation);

  gl.bindVertexArray(vao1);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  //2nd triangle
  //   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2);
  //   gl.vertexAttribPointer(
  //     positionAttribLocation2,
  //     2,
  //     gl.FLOAT,
  //     false,
  //     2 * 4,
  //     0 * 4
  //   );
  //   gl.enableVertexAttribArray(positionAttribLocation);

  //   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
  //   gl.vertexAttribPointer(
  //     colorAttribLocation2,
  //     3,
  //     gl.FLOAT,
  //     false,
  //     3 * 4,
  //     0 * 4
  //   );
  //   gl.enableVertexAttribArray(colorAttribLocation2);
  gl.bindVertexArray(vao2);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindVertexArray(null);

  requestAnimationFrame(animate);
  t++;
};

animate();
