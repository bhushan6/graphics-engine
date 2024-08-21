import { Geometry, Material, Mesh, Scene, Texture } from ".";
import { createProgram } from "../exercise/utils";
import { Camera } from "./Camera";
import { UniformType } from "./Material";
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
  private _compiledTextures: WeakMap<
    Texture,
    { glTexture: WebGLTexture; location: WebGLUniformLocation }
  > = new WeakMap();

  private _compiledUniforms: WeakMap<
    { value: UniformType } ,
    WebGLUniformLocation
  > = new WeakMap();

  private _setUniforms = (program: WebGLProgram, uniforms: { [key: string]: {value: UniformType} }) => {
    let textureIndex = 0
    // co
    Object.keys(uniforms).forEach((uniformName) => {
      const uniform = uniforms[uniformName]
      const uniformValue = uniform.value;
      if (!uniformValue) return;
      
      let location = this._compiledUniforms.get(uniform) || null
      if (!location) {
        location = this.gl.getUniformLocation(program!, uniformName);
        if(!location) return;
        this._compiledUniforms.set(uniform, location);
      }
      if (location) {
        if (typeof uniformValue === "number") {
          this.gl.uniform1f(location, uniformValue);
        } else if (uniformValue instanceof Texture) {
          this._setTextureUniforms(
            program!,
            uniformName,
            uniformValue,
            textureIndex
          );
        } else {
          switch (uniformValue.length) {
            case 2:
              this.gl.uniform2fv(location, uniformValue);
              break;
            case 3:
              this.gl.uniform3fv(location, uniformValue);
              break;
            case 4:
              this.gl.uniform4fv(location, uniformValue);
              break;
            case 9:
              this.gl.uniformMatrix3fv(location, false, uniformValue);
              break;
            case 16:
              this.gl.uniformMatrix4fv(location, false, uniformValue);
              break;
            default:
              console.log("idk");
              break;
          }
        }
      }
    });
  }

  private _initTexture = (img: Texture) => {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGB,
      img.data!.width,
      img.data!.height,
      0,
      this.gl.RGB,
      this.gl.UNSIGNED_BYTE,
      img.data!
    );
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    return texture;
  };

  private _setTextureUniforms = (
    program: WebGLProgram,
    name: string,
    texture: Texture,
    textureIndex: number
  ) => {
    if (textureIndex > 0) return;
    // console.log(textureIndex);

    if (!texture.data) return;
    let compiledTexture = this._compiledTextures.get(texture) || null;

    if (!compiledTexture) {
      const location = this.gl.getUniformLocation(program, name);
      if (!location) return;
      compiledTexture = {
        glTexture: this._initTexture(texture)!,
        location: location,
      };
      this._compiledTextures.set(texture, compiledTexture);
    }
    this.gl.uniform1i(compiledTexture.location, textureIndex);
    this.gl.activeTexture(this.gl.TEXTURE0 + textureIndex);
    this.gl.bindTexture(this.gl.TEXTURE_2D, compiledTexture.glTexture);
    textureIndex++;
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
      
      //inject internal uniforms
      mesh.material.uniforms.modelMatrix.value = mesh.matrix;
      mesh.material.uniforms.viewMatrix.value = camera.matrix;
      mesh.material.uniforms.projectionMatrix.value = camera.projectionMatrix;

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

      this._setUniforms(program, mesh.material.uniforms);

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
