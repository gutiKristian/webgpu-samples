import { GPU } from "../GPU";

/*
    This is general program that is not meant to be instantiated.
    Every new program that is implemented should extend this class and implement it.
 */
export abstract class Program
{
    protected readonly gpu: GPU;
    
    protected constructor(gpu: GPU)
    {
        this.gpu = gpu;
    }

    abstract render(): void;

}