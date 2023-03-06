import { GPUSetup } from "../GPUSetup.ts";

/*
    This is general program that is not meant to be instantiated.
    Every new program that is implemented should extend this class and implement it.
 */
export abstract class Program
{
    protected readonly gpu: GPUSetup;
    
    protected constructor(gpu: GPUSetup)
    {
        this.gpu = gpu;
    }

    abstract render(): void;

}