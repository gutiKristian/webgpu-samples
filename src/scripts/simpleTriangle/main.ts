import { GPUSetup } from "../../GPUSetup";
import { SimpleTriangle } from "./SimpleTriangle";

const main = async() => 
{
    const gpu = await GPUSetup.build("gfx-simple-triangle");
    const program = new SimpleTriangle(gpu);
    program.render();
}

main(); 