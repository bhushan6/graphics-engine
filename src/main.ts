import { Geometry, Mesh, Renderer, Material, Scene } from "./Engine";
import "./style.css";

const canvas = document.getElementById("webglCanvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("canvas not found");
}

const renderer = new Renderer(canvas);

const scene = new Scene(renderer);

const geometry = new Geometry(
  renderer.GL,
  {
    vertPos: {
      data: new Float32Array([-0.5, 0.2, -0.5, -0.2, -0.2, -0.2, 0.5, 0.2]),
      size: 2,
      offset: 0,
    },
  },
  new Uint16Array([0, 1, 2, 0, 2, 3])
);

const mat = new Material(renderer.GL);

const mesh = new Mesh(geometry, mat);

const geometry2 = new Geometry(
  renderer.GL,
  {
    vertPos: {
      data: new Float32Array([0.5, 0.2, 0.5, -0.2, 0.2, -0.2]),
      size: 2,
      offset: 0,
    },
    aColor: {
      data: new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]),
      size: 3,
      offset: 0,
    },
  },
  new Uint16Array([0, 1, 2])
);

const mat2 = new Material(renderer.GL);
const mesh2 = new Mesh(geometry2, mat2);

scene.add(mesh);
scene.add(mesh2);

let previousTime: null | number = null;
requestAnimationFrame((t) => {
  if (previousTime === null) {
    previousTime = t;
  }
  renderer.render(t - previousTime);
  scene.render();

  previousTime = t;
});
