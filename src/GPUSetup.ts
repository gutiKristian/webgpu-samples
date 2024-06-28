import shader from "./shaders.wgsl";

export class GPUSetup
{
    
    //* A GPUAdapter encapsulates an adapter, and describes its capabilities (features and limits).    
    public readonly adapter: GPUAdapter;

    //* A GPUDevice encapsulates a device and exposes the functionality of that device (Interface), most of the interaction with GPU
    public readonly device: GPUDevice;

    //* Canvas where we draw the geometry
    public readonly canvas: HTMLCanvasElement;

    //* Context that is associated with device
    public readonly context: GPUCanvasContext;

    //* Format in which textures are stored, automatically selected by WebGPU
    public readonly format: GPUTextureFormat;

    private constructor(adapter: GPUAdapter, device: GPUDevice, canvas: HTMLCanvasElement) 
    {
        this.adapter = adapter;
        this.device = device;
        this.canvas = canvas;
        this.context = <GPUCanvasContext> canvas.getContext("webgpu");
        this.format = navigator.gpu.getPreferredCanvasFormat();

        // Configuring context might change in the future -- this is default GPUCanvasConfiguration
        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode: "opaque"
        });
        
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