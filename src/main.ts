import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Geometry, Mesh, Renderer, Material, Scene } from "./Engine";
import { Camera } from "./Engine/Camera";
import "./style.css";
import { getBoxGeomertyData, getPlaneGeomertyData } from "./Engine/utils";

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

const boxAttributes = getBoxGeomertyData();
const planeAttributes = getPlaneGeomertyData();
const geometry = new Geometry({
  ...boxAttributes,
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
    ]),
  },
});

const material = new Material({
  uniforms: {
    uColor: [1, 0.3, 0.6]
  },
  vertexShader: `#version 300 es

  in vec3 position;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 normal;

  in vec3 color;
  out vec3 vColor;

  void main() {
      vColor = position;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `#version 300 es
  precision highp float;

  in vec3 vColor;

  uniform vec3 uColor;

  out vec4 fragColor;

  void main(){
      fragColor = vec4(uColor, 1.0);
  }
`,
});

const boxMesh = new Mesh(geometry, material);

const planeGeometry = new Geometry({
  ...planeAttributes,
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
    ]),
  },
});

const planeMesh = new Mesh(planeGeometry, material);
scene.add(planeMesh);
planeMesh.position[0] += 1;
boxMesh.position[0] -= 1;
scene.add(boxMesh);

camera.position[2] = -5;

window.addEventListener("resize", () => {
  renderer.resize(window.innerWidth, window.innerHeight);
  camera.aspect = gl.canvas.width / gl.canvas.height;
  camera.updateCameraMatrix();
});

let t = 0;
const boxRotation = boxMesh.rotation;
const planeRotation = planeMesh.rotation;

const dummyMat = mat4.create();
const center = vec3.create();

const animate = () => {
  // const distance = vec3.distance(center, camera.position);

  // camera.position[0] = Math.sin(t * 0.01) * distance;
  // camera.position[2] = Math.cos(t * 0.01) * distance;

  // mat4.lookAt(dummyMat, camera.position, center, [0, 1, 0]);

  // mat4.getRotation(camera.rotation, dummyMat);
  // mat4.getTranslation(camera.position, dummyMat);
  // mat4.getScaling(camera.scale, dummyMat);

  // const zoom = 1 + Math.sin(t * 0.01) * 0.01;
  // camera.getWorldDirection(cameraForward);
  // vec3.scale(cameraForward, cameraForward, zoom * 0.1);
  // camera.position[0] += cameraForward[0];
  // camera.position[1] += cameraForward[1];
  // camera.position[2] += cameraForward[2];

  // quat.fromEuler(boxRotation, 0, t * 0.6, t * 0.1);
  // quat.fromEuler(planeRotation, 0, t * 1.6, 0);
  //@ts-expect-error
  material.uniforms.uColor[0] = Math.sin(t * 0.01);
  //@ts-expect-error
  material.uniforms.uColor[1] = Math.cos(t * 0.01);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  t++;
};

const cameraForward = vec3.create();

gl.canvas.addEventListener("wheel", (e) => {
  //@ts-expect-error
  const zoom = e.wheelDeltaY;

  camera.getWorldDirection(cameraForward);
  vec3.scale(cameraForward, cameraForward, zoom * 0.1);
  camera.position[0] += cameraForward[0];
  camera.position[1] += cameraForward[1];
  camera.position[2] += cameraForward[2];
});

let mouseDown = false;

gl.canvas.addEventListener("pointerdown", () => {
  mouseDown = true;
});

gl.canvas.addEventListener("pointerup", () => {
  mouseDown = false;
});

gl.canvas.addEventListener("onblur", () => {
  mouseDown = false;
});

let theta = 0;
let phi = 0;

const distance = vec3.distance(center, camera.position);
camera.position[0] = Math.cos(theta * 0.01) * Math.cos(phi * 0.01) * distance;
camera.position[1] = Math.sin(theta * 0.01) * distance;
camera.position[2] = Math.cos(theta * 0.01) * Math.sin(phi * 0.01) * distance;

mat4.lookAt(dummyMat, camera.position, center, [0, 1, 0]);

mat4.getRotation(camera.rotation, dummyMat);
mat4.getTranslation(camera.position, dummyMat);
mat4.getScaling(camera.scale, dummyMat);

gl.canvas.addEventListener("pointermove", (e) => {
  if (!mouseDown) return;
  //@ts-expect-error
  const deltaX = e.movementX;
  //@ts-expect-error
  const deltaY = e.movementY;
  console.log(deltaX, deltaY);
  const distance = vec3.distance(center, camera.position);

  theta += deltaY;
  phi += deltaX;

  camera.position[0] = Math.cos(theta * 0.01) * Math.cos(phi * 0.01) * distance;
  camera.position[1] = Math.sin(theta * 0.01) * distance;
  camera.position[2] = Math.cos(theta * 0.01) * Math.sin(phi * 0.01) * distance;

  mat4.lookAt(dummyMat, camera.position, center, [0, 1, 0]);

  mat4.getRotation(camera.rotation, dummyMat);
  mat4.getTranslation(camera.position, dummyMat);
  mat4.getScaling(camera.scale, dummyMat);
});

animate();
