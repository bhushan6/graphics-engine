import "../../style.css";

const canvas = document.getElementById("webglCanvas") as HTMLCanvasElement;

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

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDesc);
  passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
  passEncoder.end();

  device.queue.submit([commandEncoder.finish()]);
}

webGPU();
