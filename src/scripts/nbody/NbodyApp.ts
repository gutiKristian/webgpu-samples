import { GPUSetup } from "../../GPUSetup";
import { P_GPUPipeline, Program } from "../Program";

export class NBodyApp implements Program
{
    private readonly PROGRAM_NAME: string = "NBODY APP";

    readonly gpu: GPUSetup;
    readonly pipeline: P_GPUPipeline;
    readonly bindGroup: GPUBindGroup;

    constructor(gpu: GPUSetup) 
    {
        this.gpu = gpu;
        [this.pipeline, this.bindGroup] = this.configurePipeline();
        console.log("Running:", this.PROGRAM_NAME);        
    }
    configurePipeline(): [P_GPUPipeline, GPUBindGroup] {
        throw new Error("Method not implemented.");
    }
    render(): void {
        throw new Error("Method not implemented.");
    }
}