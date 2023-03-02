import { GPU } from "../../GPU";
import { SimpleTriangle } from "./SimpleTriangle";

const main = async() => 
{
    const gpu = await GPU.build();
    const program = new SimpleTriangle(gpu);
    program.render();
}

main(); 