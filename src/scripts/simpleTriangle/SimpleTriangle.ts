import { GPUSetup } from "../../GPUSetup";
import { Program } from "../Program";
import simpleTriangle from "../../shaders/simpleTriangle.wgsl";

export class SimpleTriangle implements Program
{
    readonly gpu: GPUSetup;
    readonly pipeline: GPURenderPipeline;
    readonly bindGroup: GPUBindGroup;

    private readonly PROGRAM_NAME: string = "SIMPLE TRIANGLE";

    constructor(gpu: GPUSetup)
    {
        this.gpu = gpu;
        [this.pipeline, this.bindGroup] = this.configurePipeline();
        console.log("Program: ", this.PROGRAM_NAME);
    }


    configurePipeline(): [GPURenderPipeline, GPUBindGroup] {
        
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

        return [pipeline, bindGroup];
    }


    render = () =>
    {
        const device = this.gpu.device;
        const context = this.gpu.context;

        const commandEncoder : GPUCommandEncoder = device.createCommandEncoder();
        const textureView : GPUTextureView = context.getCurrentTexture().createView();
        const renderpass : GPURenderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: {r: 0.5, g: 0.0, b: 0.25, a: 1.0},
                loadOp: "clear",
                storeOp: "store"
            }]
        });
        renderpass.setPipeline(this.pipeline);
        renderpass.setBindGroup(0, this.bindGroup)
        renderpass.draw(3, 1, 0, 0);
        renderpass.end();

        device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(this.render);
    }

}