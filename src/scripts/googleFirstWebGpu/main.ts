import { GPUSetup } from "../../GPUSetup";
import { GoogleFirstWebGpu } from "./googleFirstWebGpu";

const main = async() => 
{
    const gpu = await GPUSetup.build("gfx-googlewebgpu");
    const program = new GoogleFirstWebGpu(gpu);
    program.render();
}

main(); 