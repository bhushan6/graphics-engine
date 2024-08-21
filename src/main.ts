import { mat4, quat, vec3 } from "gl-matrix";
import { Geometry, Mesh, Renderer, Material, Scene, Texture } from "./Engine";
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
    uColor: [1, 0.3, 0.6],
    uTexture: new Texture("/cat.jpeg"),
  },
  vertexShader: `#version 300 es

  in vec3 position;
  in vec2 uv;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 normal;

  in vec3 color;

  out vec3 vColor;
  out vec2 vUv;

  void main() {
      vColor = position;
      vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vUv;

  uniform vec3 uColor;
  uniform sampler2D uTexture;

  out vec4 fragColor;

  void main(){
      vec4 tex = texture(uTexture, vUv);
      fragColor = vec4(uColor, 1.0) * tex;
  }
`,
});

const material2 = new Material({
  uniforms: {
    uColor: [1, 0.3, 0.6],
    uTexture: new Texture("/test.jpeg"),
  },
  vertexShader: `#version 300 es

  in vec3 position;
  in vec2 uv;

  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;

  in vec3 normal;

  in vec3 color;

  out vec3 vColor;
  out vec2 vUv;

  void main() {
      vColor = position;
      vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`,
  fragmentShader: `#version 300 es
  precision highp float;

  in vec3 vColor;
  in vec2 vUv;

  uniform vec3 uColor;
  uniform sampler2D uTexture;

  out vec4 fragColor;

  void main(){
      vec4 tex = texture(uTexture, vUv);
      fragColor = vec4(uColor, 1.0) * tex;
  }
`,
});

const boxMesh = new Mesh(geometry, material2);

// for (let i = 0; i < 1000; i++) {
//   const boxMesh = new Mesh(geometry, material);
//   boxMesh.position[0] = Math.random() * 20 - 10;
//   boxMesh.position[1] = Math.random() * 20 - 10;
//   boxMesh.position[2] = Math.random() * 20 - 10;
//   scene.add(boxMesh);
// }

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

camera.position[2] = -50;

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

const forwardVector = vec3.create();

const getCameraForward = (cameraPosition: vec3, targetPosition: vec3) => {
  vec3.subtract(forwardVector, cameraPosition, targetPosition);
  vec3.normalize(forwardVector, forwardVector);
  return forwardVector;
};
const rightVector = vec3.create();
const tempUpVector = vec3.fromValues(0, 1, 0);
const upVector = vec3.create();
const getUpDirection = (cameraPosition: vec3, targetPosition: vec3) => {
  getCameraForward(cameraPosition, targetPosition);
  vec3.cross(rightVector, tempUpVector, forwardVector);
  vec3.normalize(rightVector, rightVector);
  vec3.cross(upVector, forwardVector, rightVector);
  vec3.normalize(upVector, upVector);
  return upVector;
};

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

  quat.fromEuler(boxRotation, 0, t * 0.6, t * 0.1);
  quat.fromEuler(planeRotation, 0, t * 1.6, 0);
  //@ts-expect-error
  material.uniforms.uColor[0] = Math.sin(t * 0.01);
  //@ts-expect-error
  material.uniforms.uColor[1] = Math.cos(t * 0.01);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  t++;
};

// const cameraForward = vec3.create();

gl.canvas.addEventListener("wheel", (e) => {
  //@ts-expect-error
  const zoom = e.wheelDeltaY;

  // camera.getWorldDirection(cameraForward);
  const cameraForward = getCameraForward(camera.position, center);
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
let phi = Math.PI / 2;

const distance = vec3.distance(center, camera.position);
camera.position[0] = Math.cos(theta) * Math.cos(phi) * distance;
camera.position[1] = Math.sin(theta) * distance;
camera.position[2] = Math.cos(theta) * Math.sin(phi) * distance;

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
  // console.log(deltaX, deltaY);

  theta += deltaY * 0.01;
  phi += deltaX * 0.01;

  const distance = Math.abs(vec3.distance(center, camera.position));

  const newPos: [number, number, number] = [
    Math.cos(theta) * Math.cos(phi) * distance,
    Math.sin(theta) * distance,
    Math.cos(theta) * Math.sin(phi) * distance,
  ];
  const upVector = getUpDirection(camera.position, center);
  mat4.lookAt(dummyMat, newPos, center, upVector);

  mat4.getRotation(camera.rotation, dummyMat);
  mat4.getTranslation(camera.position, dummyMat);
});

animate();

// console.log(SharedArrayBuffer);
