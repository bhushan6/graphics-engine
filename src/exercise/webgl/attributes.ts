import "../style.css";
import {
  createAttribute,
  createGLContext,
  createProgram,
  resizeCanvas,
} from "./utils";

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
    
    void main(){
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

const bufferData = new Float32Array([
  0.0, 0.0, 150.0, 1.0, 0.0, 0.0, 
  -0.5, -0.5, 100.0, 0.0, 1.0, 0.0, 
  0.5, -0.5, 150.0, 0.0, 0.0, 1.0, 
  0.5, 0.5, 100.0, 1.0, 1.0, 0.0, 
  -0.5, 0.5, 150.0, 1.0, 0.0, 1.0,
  -0.5, 0.0, 150.0, 1.0, 1.0, 1.0
]);

const buffer = gl.createBuffer();
if (!buffer) throw new Error("could not create buffer");

const positionAttributeLocation = gl.getAttribLocation(program, "aPosition");
const enablePositionAttribute = createAttribute(gl, {
  buffer,
  bufferData,
  location: positionAttributeLocation,
  size: 2,
  strideInBytes: 6 * 4,
  offsetInBytes: 0 * 4,
});

const sizeAttributeLocation = gl.getAttribLocation(program, "aSize");
const enableSizeAttribute = createAttribute(gl, {
  buffer,
  bufferData,
  location: sizeAttributeLocation,
  size: 1,
  strideInBytes: 6 * 4,
  offsetInBytes: 2 * 4,
});

const colorAttributeLocation = gl.getAttribLocation(program, "aColor");
const enableColorAttribute = createAttribute(gl, {
  buffer,
  bufferData,
  location: colorAttributeLocation,
  size: 3,
  strideInBytes: 6 * 4,
  offsetInBytes: 3 * 4,
});

gl.drawArrays(gl.TRIANGLES, 0, 6);

const program2 = createProgram(
  gl,
  `#version 300 es
  
      in vec2 aPosition;
      
      void main(){
          gl_Position = vec4(aPosition, 0.0, 1.0);
          gl_PointSize = 150.0;
      }
      `,
  `#version 300 es
      
      precision highp float;
      
      out vec4 fragColor;
  
      void main() {
          fragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }
      `
);

const bufferData2 = new Float32Array([0.0, 0.5]);

const positionAttributeLocation2 = gl.getAttribLocation(program2, "aPosition");
const buffer2 = gl.createBuffer();

if (!buffer2) throw new Error("could not create buffer");

const enablePositionAttribute2 = createAttribute(gl, {
  buffer: buffer2,
  bufferData: bufferData2,
  location: positionAttributeLocation2,
  size: 2,
  strideInBytes: 2 * 4,
  offsetInBytes: 0 * 4,
});

gl.drawArrays(gl.POINTS, 0, 1);

window.onresize = () => {
  resizeCanvas();
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clearDepth(1.0);

  gl.useProgram(program);

  enablePositionAttribute();
  enableColorAttribute();
  enableSizeAttribute();

  gl.drawArrays(gl.LINE_LOOP, 0, 5);

  gl.useProgram(program2);
  enablePositionAttribute2();
  gl.drawArrays(gl.POINTS, 0, 1);
};
