import { GPUSetup } from "../GPUSetup";

// Distinguish my types from webgpu's
export interface P_GPUPipeline
{
    render?: GPURenderPipeline,
    compute?: GPUComputePipeline
}

/*
    This is general program that is not meant to be instantiated.
    Every new program that is implemented should implement this interface.
 */
export interface Program
{
    readonly gpu: GPUSetup;
    readonly pipeline: P_GPUPipeline;
    readonly bindGroup: GPUBindGroup;

    configurePipeline(): [P_GPUPipeline, GPUBindGroup];

    render(): void;

}