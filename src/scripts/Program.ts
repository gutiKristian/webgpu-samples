import { GPUSetup } from "../GPUSetup";

/*
    This is general program that is not meant to be instantiated.
    Every new program that is implemented should implement this interface.
 */
export interface Program
{
    readonly gpu: GPUSetup;
    readonly pipeline: GPURenderPipeline;
    readonly bindGroup: GPUBindGroup;

    configurePipeline(): [GPURenderPipeline, GPUBindGroup];

    render(): void;

}