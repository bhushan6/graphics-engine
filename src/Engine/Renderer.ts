import { Geometry, Material, Mesh, Scene } from ".";
import { createProgram } from "../exercise/utils";
import { Camera } from "./Camera";
export class Renderer {
  private canvas: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("webgl2");

    if (!ctx) {
      alert("WebGL2 not supported, such a shame!");
      throw new Error("WebGL2 not supported, such a shame!");
    }

    this.gl = ctx;

    this.resize(window.innerWidth, window.innerHeight);
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private _compiledGeometries: WeakMap<Geometry, WebGLVertexArrayObject> =
    new WeakMap();
  private _compiledMaterials: WeakMap<Material, WebGLProgram> = new WeakMap();

  // private _compiledAttributes: WeakMap<Geometry, WebGLBuffer> = new WeakMap();

  private _setCommonUniforms = (
    program: WebGLProgram,
    camera: Camera,
    mesh: Mesh
  ) => {
    const modelUniformLocation = this.gl.getUniformLocation(
      program,
      "modelMatrix"
    );
    const viewUniformLocation = this.gl.getUniformLocation(
      program,
      "viewMatrix"
    );
    const projectionUniformLocation = this.gl.getUniformLocation(
      program,
      "projectionMatrix"
    );

    this.gl.uniformMatrix4fv(modelUniformLocation, false, mesh.matrix);
    this.gl.uniformMatrix4fv(viewUniformLocation, false, camera.matrix);
    this.gl.uniformMatrix4fv(
      projectionUniformLocation,
      false,
      camera.projectionMatrix
    );
  };

  public render(scene: Scene, camera: Camera) {
    this.gl.clearColor(0.9, 1, 0.9, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.disable(this.gl.CULL_FACE);

    camera.updateMatrix();

    const renderableMeshes: Mesh[] = [];

    scene.children.forEach((node) => {
      if (node instanceof Mesh) {
        renderableMeshes.push(node);
      }
      node.traverse((child) => {
        if (child instanceof Mesh) {
          renderableMeshes.push(child);
        }
      });
    });

    renderableMeshes.forEach((mesh) => {
      mesh.updateMatrix();
      mesh.material.uniforms.modelMatrix = mesh.matrix;
      mesh.material.uniforms.viewMatrix = camera.matrix;
      mesh.material.uniforms.projectionMatrix = camera.projectionMatrix;

      let program = this._compiledMaterials.get(mesh.material) || null;
      if (!program) {
        program = createProgram(
          this.gl,
          mesh.material.vertexShader,
          mesh.material.fragmentShader
        );
        this._compiledMaterials.set(mesh.material, program);
      }
      if (!program) throw new Error("no program");

      this._setCommonUniforms(program, camera, mesh);

      Object.keys(mesh.material.uniforms).forEach((uniformName) => {
        
        const location = this.gl.getUniformLocation(program!, uniformName);
        if(location !== -1){
          const uniformValue = mesh.material.uniforms[uniformName];
          if(typeof uniformValue === "number"){
            this.gl.uniform1f(location, uniformValue);
          }else {
            switch (uniformValue.length) {
              case 2:
                return this.gl.uniform2fv(location, uniformValue)
              case 3:
                return this.gl.uniform3fv(location, uniformValue)
              case 4:
                return this.gl.uniform4fv(location, uniformValue)
              case 9:
                return this.gl.uniformMatrix3fv(location, false, uniformValue)
              case 16:
                return this.gl.uniformMatrix4fv(location, false, uniformValue)
            }
          }
        }
      })

      this.gl.useProgram(program);
      let vao = this._compiledGeometries.get(mesh.geometry) || null;
      vao && this.gl.bindVertexArray(vao);
      if (!vao) {
        vao = this.gl.createVertexArray();
        if (!vao) throw new Error("no vao created");
        this.gl.bindVertexArray(vao);
        this._compiledGeometries.set(mesh.geometry, vao);
        Object.keys(mesh.geometry.attributes).forEach((attribName) => {
          const attributeData = mesh.geometry.attributes[attribName];
          const buffer = this.gl.createBuffer();
          const type =
            attribName === "index"
              ? this.gl.ELEMENT_ARRAY_BUFFER
              : this.gl.ARRAY_BUFFER;
          this.gl.bindBuffer(type, buffer);
          this.gl.bufferData(type, attributeData.data, this.gl.STATIC_DRAW);
          // console.log(attribName, attributeData.data, type);

          if (attribName !== "index") {
            const attribLocation = this.gl.getAttribLocation(
              program!,
              attribName
            );
            if (attribLocation !== -1) {
              this.gl.enableVertexAttribArray(attribLocation);

              this.gl.vertexAttribPointer(
                attribLocation,
                attributeData.size,
                this.gl.FLOAT,
                false,
                attributeData.size * attributeData.data.BYTES_PER_ELEMENT,
                0 * 4
              );
            }
          }
        });
      }

      this.gl.drawElements(
        this.gl.TRIANGLES,
        mesh.geometry.indices.length,
        this.gl.UNSIGNED_BYTE,
        0
      );
      this.gl.bindVertexArray(null);
    });
  }
}
