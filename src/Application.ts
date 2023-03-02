import shader from "./shaders.wgsl";

/*
    Init Adapter and Device.
    GPUAdapter: 
*/
export class Application
{

    readonly adapter: GPUAdapter;
    readonly device: GPUDevice;

    private constructor(adapter: GPUAdapter, device: GPUDevice) 
    {
        this.adapter = adapter;
        this.device = device;
    }

    
    listGPUInfo(): void {
        
        if (!this.adapter)
        {
            console.log("Adapter has not been initialized.");
            console.log("Check if the WebGPU flag is enabled.");
        }

        const info = this.adapter.requestAdapterInfo();
        console.log(info);
    }

    // 'Builder'
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