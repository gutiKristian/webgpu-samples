import shader from "./shaders.wgsl";

export class GPUSetup
{
    
    //* A GPUAdapter encapsulates an adapter, and describes its capabilities (features and limits).    
    public readonly adapter: GPUAdapter;

    //* A GPUDevice encapsulates a device and exposes the functionality of that device
    public readonly device: GPUDevice;
    
    public readonly canvas: HTMLCanvasElement;
    public readonly context: GPUCanvasContext;
    public readonly format: GPUTextureFormat;

    private constructor(adapter: GPUAdapter, device: GPUDevice, canvas: HTMLCanvasElement) 
    {
        this.adapter = adapter;
        this.device = device;
        this.canvas = canvas;
        this.context = <GPUCanvasContext> canvas.getContext("webgpu");
        this.format = "bgra8unorm";

        // Configuring context might change in the future -- this is default GPUCanvasConfiguration
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: "opaque"
        });


    }

    public listGPUInfo(): void {
        
        if (!this.adapter)
        {
            console.log("Adapter has not been initialized.");
            console.log("Check if the WebGPU flag is enabled.");
        }

        const info = this.adapter.requestAdapterInfo();
        console.log(info);
    }

    // 'Builder'
    public static async build(canvasName: string): Promise<GPUSetup>
    {
        if (!canvasName || canvasName.length == 0)
        {
            alert("Canvas name not provided!");
            throw new Error("Please provide canvas name to attach the webgpu");
        }

        const canvas = <HTMLCanvasElement> document.getElementById(canvasName); 

        if (!canvas)
        {
            alert("Could not find canvas!");
            throw new Error("Didn't find the canvas, please check if the id is correct");
        }

        if (!navigator.gpu)
        {
            alert("WebGPU is not enabled!");
            throw new Error("This browser does not support the WebGPU");
        }

        const adapter = await navigator.gpu?.requestAdapter() as GPUAdapter; 

        const device = await adapter?.requestDevice() as GPUDevice;

        return new GPUSetup(adapter, device, canvas);
    }

}