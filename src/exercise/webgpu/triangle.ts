import "../../style.css";

const shader = `
struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
};

@vertex
fn vs_main(
  @builtin(vertex_index) in_vertex_index: u32,
) -> VertexOutput {
  var out: VertexOutput;
  let x = f32(1 - i32(in_vertex_index)) * 0.5;
  let y = f32(i32(in_vertex_index & 1u) * 2 - 1) * 0.5;
  out.clip_position = vec4<f32>(x, y, 0.0, 1.0);
  return out;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(0.0, 0.8, 0.1, 1.0);
}
`

const canvas = document.getElementById("webglCanvas") as HTMLCanvasElement;

canvas.width = window.innerWidth
canvas.height = window.innerHeight

if (!canvas) {
  throw new Error("Canvas not found");
}

async function webGPU() {
  if (!navigator.gpu) {
    throw new Error("WebGPU is not available");
  }

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "low-power",
  });
  if (!adapter) {
    throw new Error("Failed to get an adapter");
  }

  const device = await adapter.requestDevice();
  if (!device) {
    throw new Error("Failed to get device from adapter");
  }

  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error("WebGPU context not found");
  }

  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: "opaque",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const colorTexture = context.getCurrentTexture();
  const colorTextureView = colorTexture.createView();

  const colorAttachment = {
    view: colorTextureView,
    clearValue: { r: 1, g: 0, b: 0, a: 1 },
    loadOp: "clear",
    storeOp: "store",
  };

  const renderPassDesc: GPURenderPassDescriptor = {
    //@ts-expect-error
    colorAttachments: [colorAttachment],
  };

  const shaderModule = device.createShaderModule({
    code: shader
  })

  const layout = device.createPipelineLayout({
    bindGroupLayouts: []
  })

  const colorState: GPUColorTargetState = {
    format: "bgra8unorm"
  }

  const pipelineLayout: GPURenderPipelineDescriptor = {
      layout,
      vertex: {
        module: shaderModule,
        entryPoint: "vs_main",
        buffers: []
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [colorState]
      },
      primitive: {
        topology: 'triangle-list',
        frontFace: "ccw",
        cullMode: "back"
      }
  }

  const pipeline = device.createRenderPipeline(pipelineLayout)

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
  passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
  passEncoder.setPipeline(pipeline)
  passEncoder.draw(3, 1)
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
}

webGPU();
