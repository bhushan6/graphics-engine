import "../style.css";
import { createGLContext, createProgram } from "./utils";

const gl = createGLContext();

gl.clearColor(0.1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.clearDepth(1.0);

const program = createProgram(
  gl,
  `#version 300 es
    
    void main(){
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        gl_PointSize = 150.0;
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

const colorUniformLocation = gl.getUniformLocation(program, "uColor");
gl.uniform3f(colorUniformLocation, 1.0, 0.0, 0.0);

// gl.drawArrays(gl.POINTS, 0, 1);

const program2 = createProgram(
  gl,
  `#version 300 es
      uniform vec2 aPosition;

      void main(){
          gl_Position = vec4(aPosition, 0.0, 1.0);
          gl_PointSize = 150.0;
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

const colorUniformLocation2 = gl.getUniformLocation(program2, "uColor");
const positionUniformLocation = gl.getUniformLocation(program2, "aPosition");

gl.uniform3f(colorUniformLocation2, 0.0, 1.0, 0.0);
gl.uniform2f(positionUniformLocation, 0.0, 0.0);

// gl.drawArrays(gl.POINTS, 0, 1);
let t = 0;
const render = () => {
  gl.clearColor(0.1, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clearDepth(1.0);
  //1st draw call
  gl.useProgram(program);
  gl.drawArrays(gl.POINTS, 0, 1);

  //2nd draw call
  gl.useProgram(program2);
  gl.uniform3f(
    colorUniformLocation2,
    (Math.cos(t) + 2) * 0.5,
    (Math.sin(t) + 2) * 0.5,
    0.0
  );
  // change the uniform after using the program
  gl.uniform2f(positionUniformLocation, Math.sin(t), 0.0);
  gl.drawArrays(gl.POINTS, 0, 1);

  gl.useProgram(null);
  requestAnimationFrame(render);
  t += 0.01;
};

render();
