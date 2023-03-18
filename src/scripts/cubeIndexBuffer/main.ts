import { GPUSetup } from "../../GPUSetup";
import { CubeIndexBuff } from "./CubeIndexBuff";

const main = async() => 
{
    const gpu = await GPUSetup.build("gfx-cube-index");
    const program = new CubeIndexBuff(gpu);
    program.render();
}

main(); 