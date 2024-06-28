import { GPUSetup } from "../../GPUSetup";
import { Program } from "../Program";
import googleExample from "../../shaders/googleExample.wgsl";

export class GoogleFirstWebGpu implements Program
{
    readonly gpu: GPUSetup;
    pipeline: GPURenderPipeline | undefined;
    bindGroup: GPUBindGroup | undefined;

    private readonly PROGRAM_NAME: string = "Google example";

    private vertices = new Float32Array([
        //   X,    Y,
          -0.8, -0.8, // Triangle 1 (Blue)
           0.8, -0.8,
           0.8,  0.8,
        
          -0.8, -0.8, // Triangle 2 (Red)
           0.8,  0.8,
          -0.8,  0.8,
    ]);

    private vertexBuffer: GPUBuffer | undefined;

    constructor(gpu: GPUSetup)
    {
        this.gpu = gpu;
        this.configurePipeline();
        console.log("Program: ", this.PROGRAM_NAME);
    }


    configurePipeline(): void {
        
        const device = this.gpu.device;
        const format = this.gpu.format;


        this.vertexBuffer = device.createBuffer({
            label: "Cell vertices", //* Labels are used in error messages so it is good to use them!
            size: this.vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        device.queue.writeBuffer(this.vertexBuffer, /*bufferOffset=*/0, this.vertices);
        
        const vertexBufferLayout: GPUVertexBufferLayout  = {
            arrayStride: 8,
            attributes: [{
              format: "float32x2",
              offset: 0,
              shaderLocation: 0, // Position, see vertex shader
            }],
        };

        const bindGroupLayout = device.createBindGroupLayout({
            entries: [],
        });
    
        const bindGroup = device.createBindGroup({
            layout: bindGroupLayout,
            entries: []
        });
        
        const cellShaderModule: GPUShaderModule = device.createShaderModule({
            code: googleExample
        });

        const pipeline: GPURenderPipeline = device.createRenderPipeline({
            vertex : {
                module : cellShaderModule,
                entryPoint : "vs_main",
                buffers: [vertexBufferLayout]
            },
    
            fragment : {
                module : cellShaderModule,
                entryPoint : "fs_main",
                targets : [{
                    format : format
                }]
            },
    
            primitive : {
                topology : "triangle-list"
            },
    
            layout: "auto"
        });
        
        this.pipeline = pipeline;
        this.bindGroup = bindGroup;
    }


    render = () =>
    {
        const device = this.gpu.device;
        const context = this.gpu.context;
        const commandEncoder = device.createCommandEncoder();
        
        //* Render pass --> where all drawing operations
        const pass = commandEncoder.beginRenderPass({

            //* As you can see we can have multiple color attachments (it's an array), we can output result
            //* to them, for instance depth texture 
            colorAttachments:[{
                //* Texture where we store the output
                view: context.getCurrentTexture().createView(),

                //* What to do prior renderpass
                loadOp: "clear",

                //* What to do after renderpass
                storeOp: "store",

                clearValue: { r: 1, g: 0, b: 1, a: 1 }
            }]
        });
       
        pass.setPipeline(this.pipeline!);
        pass.setVertexBuffer(0, this.vertexBuffer!);
        pass.draw(this.vertices.length / 2); // 6 vertices
        pass.end();

        const commandBuffer = commandEncoder.finish();

        device.queue.submit([commandBuffer]);
    }

}
