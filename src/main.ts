import { quat } from "gl-matrix";
import { Geometry, Mesh, Renderer, Material, Scene } from "./Engine";
import { Camera } from "./Engine/Camera";
import "./style.css";

const canvas = document.getElementById("webglCanvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("canvas not found");
}

const renderer = new Renderer(canvas);

const scene = new Scene();

const gl = renderer.gl;

const camera = new Camera({
  fov: Math.PI / 6,
  aspect: gl.canvas.width / gl.canvas.height,
  near: 0.1,
  far: 100,
});

const geometry = new Geometry({
  position: {
    size: 3,
    data: new Float32Array([
      0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5,
      0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
      0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5, -0.5, 0.5,
    ]),
  },
  normal: {
    size: 3,
    data: new Float32Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
      -1, 0, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, 1,
    ]),
  },
  uv: {
    size: 2,
    data: new Float32Array([
      0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0,
      1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0,
    ]),
  },
  index: {
    size: 1,
    data: new Uint8Array([
      0, 2, 1, 2, 3, 1, 4, 6, 5, 6, 7, 5, 8, 10, 9, 10, 11, 9, 12, 14, 13, 14,
      15, 13, 16, 18, 17, 18, 19, 17, 20, 22, 21, 22, 23, 21,
    ]),
  },
  color: {
    size: 3,
    data: new Float32Array([
      1, 0, 0, 1, 0, 0, 1, 0, 0,

      0, 1, 0, 0, 1, 0, 0, 1, 0,

      0, 0, 1, 0, 0, 1, 0, 0, 1,

      1, 0, 1, 1, 0, 1, 1, 0, 1,

      1, 1, 0, 1, 1, 0, 1, 1, 0,

      0, 1, 1, 0, 1, 1, 0, 1, 1,

      0, 1, 1, 0, 1, 1, 0, 1, 1,

      1, 0, 1, 1, 0, 1, 1, 0, 1,
    ])
  },
});

const material = new Material({
  uniforms: {},
  vertexShader: `#version 300 es

  in vec3 position;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 normal;
  out vec3 vNormal;

  in vec3 color;
  out vec3 vColor;

  void main() {
      vNormal = normal;
      vColor = color;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `#version 300 es
  precision highp float;

  in vec3 vNormal;
  in vec3 vColor;

  out vec4 fragColor;

  void main(){
      fragColor = vec4(vColor, 1.0);
  }
`,
});

const mesh = new Mesh(geometry, material);

scene.add(mesh);

camera.position[2] = -5;

window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight);
  camera.aspect = gl.canvas.width / gl.canvas.height;
  camera.updateCameraMatrix();
});
let t = 0;
const rotation = mesh.rotation;
const animate = () => {
  quat.fromEuler(rotation, 0, t * 0.6, t * 0.1);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  t++;
};

animate();
