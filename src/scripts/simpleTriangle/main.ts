import { GPUSetup } from "../../GPUSetup";
import { SimpleTriangle } from "./SimpleTriangle";

const main = async() => 
{
    const gpu = await GPUSetup.build();
    const program = new SimpleTriangle(gpu);
    program.render();
}

main(); 