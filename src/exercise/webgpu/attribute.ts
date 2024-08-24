import "../../style.css";

const shader = `
struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) color: vec3<f32>,
};

@vertex
fn vs_main(
    @location(0) inPos: vec3<f32>,
) -> VertexOutput {
    var out: VertexOutput;
    out.clip_position = vec4<f32>(inPos.x, inPos.y, 0.0, 1.0);
    out.color = vec3<f32>(0.0, 0.4, 0.9);
    return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    return vec4<f32>(in.color, 1.0);
}
`;

const canvas = document.getElementById("webglCanvas") as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if (!canvas) {
  throw new Error("np canvas");
}

const webgpu = async () => {
  if (!navigator.gpu) {
    throw new Error(" no gpu navigator");
  }

  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw new Error("no adapter");
  }

  const device = await adapter.requestDevice();

  if (!device) {
    throw new Error("no device in adapter");
  }

  const context = canvas.getContext("webgpu");

  if (!context) {
    throw new Error("no webgpu context");
  }

  const preferredCanvasFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    format: preferredCanvasFormat,
    device,
    alphaMode: "opaque",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const positions = new Float32Array([1.0, -1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 1.0, 0.0]);

  const positionBufferDesc = {
    size: positions.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true,
  };

  const positionBuffer = device.createBuffer(positionBufferDesc);

  const writeArray = new Float32Array(positionBuffer.getMappedRange());
  writeArray.set(positions);
  positionBuffer.unmap();

  const shaderModule = device.createShaderModule({
    code: shader,
  });

  const layout = device.createPipelineLayout({
    bindGroupLayouts: [],
  });

  const colorState: GPUColorTargetState = {
    format: preferredCanvasFormat,
  };

  const pipeline = device.createRenderPipeline({
    layout,
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
      buffers: [
        {
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
            },
          ],
          arrayStride: positions.BYTES_PER_ELEMENT * 3,
          stepMode: "vertex",
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [colorState],
    },
    primitive: {
      topology: "triangle-list",
      frontFace: "ccw",
      cullMode: "none",
    },
  });

  const colorTexture = context.getCurrentTexture();
  const colorTextureView = colorTexture.createView();

  const colorAttachment: GPURenderPassColorAttachment = {
    view: colorTextureView,
    clearValue: { r: 1, g: 0, b: 0, a: 1 },
    loadOp: "clear",
    storeOp: "store",
  };

  const renderPassDesc: GPURenderPassDescriptor = {
    colorAttachments: [colorAttachment],
  };

  const commandEncoder = device.createCommandEncoder();

  const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
  passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
  passEncoder.setPipeline(pipeline);
  passEncoder.setVertexBuffer(0, positionBuffer);
  passEncoder.draw(3, 1);
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
};

webgpu();
