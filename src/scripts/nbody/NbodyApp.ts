import { GPUSetup } from "../../GPUSetup";

export class NBodyApp
{
    private application: GPUSetup;

    constructor(app: GPUSetup) 
    {
        this.application = app;
    }
}