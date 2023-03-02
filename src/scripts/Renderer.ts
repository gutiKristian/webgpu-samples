import { Application } from "../Application";

export abstract class Renderer
{
    protected readonly app: Application;
    
    protected constructor(app: Application)
    {
        this.app = app;
    }

    abstract render(): void;

}