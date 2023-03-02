import shader from "./shaders.wgsl";

export class Application
{

    readonly adapter: GPUAdapter;
    readonly device: GPUDevice;

    private constructor(adapter: GPUAdapter, device: GPUDevice) 
    {
        this.adapter = adapter;
        this.device = device;
    }

    public static async build(): Promise<Application>
    {
        if (!navigator.gpu)
        {
            throw new Error("This browser does not support the WebGPU");
        }

        const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter; 

        const device = await adapter?.requestDevice() as GPUDevice;

        return new Application(adapter, device);
    }

    
}