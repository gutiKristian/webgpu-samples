import { GPUSetup } from "../../GPUSetup";
import { P_GPUPipeline, Program } from "../Program";
import simpleTriangle from "../../shaders/simpleTriangle.wgsl";

export class GoogleFirstWebGpu implements Program
{
    readonly gpu: GPUSetup;
    readonly pipeline: P_GPUPipeline;
    readonly bindGroup: GPUBindGroup;

    private readonly PROGRAM_NAME: string = "Google example";

    constructor(gpu: GPUSetup)
    {
        this.gpu = gpu;
        [this.pipeline, this.bindGroup] = this.configurePipeline();
        console.log("Program: ", this.PROGRAM_NAME);
    }


    configurePipeline(): [P_GPUPipeline, GPUBindGroup] {
        
        const device = this.gpu.device;
        const format = this.gpu.format;

        const bindGroupLayout = device.createBindGroupLayout({
            entries: [],
        });
    
        const bindGroup = device.createBindGroup({
            layout: bindGroupLayout,
            entries: []
        });
        
        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });
    
        const pipeline = device.createRenderPipeline({
            vertex : {
                module : device.createShaderModule({
                    code : simpleTriangle
                }),
                entryPoint : "vs_main"
            },
    
            fragment : {
                module : device.createShaderModule({
                    code : simpleTriangle
                }),
                entryPoint : "fs_main",
                targets : [{
                    format : format
                }]
            },
    
            primitive : {
                topology : "triangle-list"
            },
    
            layout: pipelineLayout
        });

        return [{render: pipeline}, bindGroup];
    }


    render = () =>
    {
        const device = this.gpu.device;
        const context = this.gpu.context;
        const commandEncoder = this.gpu.encoder;
        
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
       
        pass.end();

        const commandBuffer = commandEncoder.finish();

        device.queue.submit([commandBuffer]);
    }

}
