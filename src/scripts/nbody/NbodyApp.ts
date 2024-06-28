import { GPUSetup } from "../../GPUSetup";
import { Program } from "../Program";
import nbodyCompute from "../../shaders/NBodyCompute.wgsl";

export class NBodyApp implements Program
{
    private readonly PROGRAM_NAME: string = "NBODY APP";

    readonly gpu: GPUSetup;
    pipeline: GPUComputePipeline | undefined;
    bindGroup: GPUBindGroup | undefined;

    constructor(gpu: GPUSetup) 
    {
        this.gpu = gpu;
        this.configurePipeline();
        console.log("Running:", this.PROGRAM_NAME);        
    }
    configurePipeline(): void {
        const device = this.gpu.device;
        const format = this.gpu.format;
        //! NOT FINISHED

        // Configure layout 
        const computeBindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 1, // variable in wgsl
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {
                        type: "storage"
                    }
                }
            ],
        });
        
        const computePipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [computeBindGroupLayout]
        });

        const bindGroup = device.createBindGroup({
            layout: computeBindGroupLayout,
            entries: []
        });
        
        // Create compute pipeline for position calculation
        const computePipeline = device.createComputePipeline({
            compute: {
                module: device.createShaderModule({
                    code: nbodyCompute
                }),
                entryPoint: "c_main"
            },
            layout: computePipelineLayout
        });



        this.pipeline = computePipeline;
        
    }
    render(): void {
        const device = this.gpu.device;
        const context = this.gpu.context;

        const commandEncoder: GPUCommandEncoder = device.createCommandEncoder();
        const passEncoder: GPUComputePassEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.pipeline!);
        passEncoder.dispatchWorkgroups(1);
        passEncoder.end();
        const commands: GPUCommandBuffer = commandEncoder.finish();
        
        device.queue.submit([commands]);
        
        requestAnimationFrame(this.render);
    }
}