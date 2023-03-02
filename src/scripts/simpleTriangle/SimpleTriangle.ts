import { GPU } from "../../GPU";
import { Program } from "../Program";

export class SimpleTriangle extends Program
{
    private readonly PROGRAM_NAME: string = "SIMPLE TRIANGLE";

    constructor(gpu: GPU)
    {
        super(gpu);
    }

    render(): void 
    {
        console.log(this.PROGRAM_NAME);
    }

}