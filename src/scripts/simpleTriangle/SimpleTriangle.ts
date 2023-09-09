import { GPUSetup } from "../../GPUSetup";
import { P_GPUPipeline, Program } from "../Program";
import simpleTriangle from "../../shaders/simpleTriangle.wgsl";

export class SimpleTriangle implements Program
{
    readonly gpu: GPUSetup;
    readonly pipeline: P_GPUPipeline;
    readonly bindGroup: GPUBindGroup;

    private readonly PROGRAM_NAME: string = "SIMPLE TRIANGLE";

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
        
        const textureView : GPUTextureView = context.getCurrentTexture().createView();
        const renderpass : GPURenderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
                loadOp: "clear",
                storeOp: "store"
            }]
        });
        renderpass.setPipeline(this.pipeline.render!);
        renderpass.setBindGroup(0, this.bindGroup)
        renderpass.draw(3, 1, 0, 0);
        renderpass.end();

        device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(this.render);
    }

}
