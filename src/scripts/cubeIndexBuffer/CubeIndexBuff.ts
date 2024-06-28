import { GPUSetup } from "../../GPUSetup";
import { Program } from "../Program";
import shader from "../../shaders/cubeIndexBuff.wgsl";
import { mat4 } from "gl-matrix";

export class CubeIndexBuff implements Program
{
    readonly gpu: GPUSetup;
    pipeline: GPURenderPipeline | undefined;
    bindGroup: GPUBindGroup | undefined;

    private readonly PROGRAM_NAME: string = "CUBE INDEX";
    private vertexBuffer: GPUBuffer | undefined;
    private indexBuffer: GPUBuffer | undefined;
    private uniformBuffer: GPUBuffer | undefined;

    constructor(gpu: GPUSetup)
    {
        this.gpu = gpu;
        this.configurePipeline();
        console.log("Program: ", this.PROGRAM_NAME);
    }


    configurePipeline(): void {
        
        const device = this.gpu.device;
        const format = this.gpu.format;
        
        //! Vertex buffer
        // cube
        const vertices: Float32Array = new Float32Array(
            [   // POSITIONS        // COLOR
                -0.5, -0.5,  0.5,   0.0, 0.0, 0.0,  // v0 Maroon
                0.5, -0.5,  0.5,    0.957, 0.507, 0.1875,  // v1 Orange
                -0.5,  0.5,  0.5,   1.0, 0.8789, 0.0976,  // v2 Yellow
                0.5,  0.5,  0.5,    0.0, 0.0, 0.5,  // v3 Navy
                -0.5, -0.5, -0.5,   0.0, 0.5, 0.78125,  // v4  Blue
                0.5, -0.5, -0.5,    0.0, 0.0, 0.0,  // v5 Black
                -0.5,  0.5, -0.5,   1.0, 1.0, 1.0,  // v6 White
                0.5,  0.5, -0.5,    0.5, 0.5, 0.5   // v7 Grey
            ]
        );
        
        // buffer description
        const vertBuffDesc: GPUBufferDescriptor = 
        {
            size: vertices.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        };
        // create the buffer with the provided description
        this.vertexBuffer = device.createBuffer(vertBuffDesc);
        
        // copy the data to the buffer and then unmap the buffer
        new Float32Array(this.vertexBuffer.getMappedRange()).set(vertices);
        this.vertexBuffer.unmap();
        
        // specify the layout of this buffer
        const vertBufLayout: GPUVertexBufferLayout = 
        {
            arrayStride: 24, // six 32b/4B numbers
            attributes: [
                {
                    shaderLocation: 0,
                    format: "float32x3",
                    offset: 0
                },
                // color, it is offset by three 32bit/4B floats - position
                {
                    shaderLocation: 1,
                    format: "float32x3",
                    offset: 12
                }
            ]
        };

        //! Index buffer

        const indices: Uint16Array = new Uint16Array([
            1, 5, 3, 5, 7, 3,
            0, 1, 4, 1, 5, 4,
            2, 3, 6, 3, 7, 6,
            4, 5, 6, 5, 7, 6,
            4, 0, 6, 0, 2, 6,
            0, 1, 2, 1, 3, 2 // front face -- depth test is not enabled yet
        ]);
        
        const indiBuffDesc: GPUBufferDescriptor = 
        {
            size: indices.byteLength,
            usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true
        };

        this.indexBuffer = device.createBuffer(indiBuffDesc);

        new Uint16Array(this.indexBuffer.getMappedRange()).set(indices);
        this.indexBuffer.unmap();
        
        //! Create matrix data
        
        const projection = mat4.create();
        mat4.perspective(projection, Math.PI / 3, 800/600, 0.1, 10);
        
        const view = mat4.create();
        mat4.lookAt(view, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

        const model = mat4.create();
        mat4.rotate(model, model, Math.PI / 4 , [0, 1, 0]);

        this.uniformBuffer = device.createBuffer({
            size: 3 * 64,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        device.queue.writeBuffer(this.uniformBuffer, 0, <ArrayBuffer>model);
        device.queue.writeBuffer(this.uniformBuffer, 64, <ArrayBuffer>view);
        device.queue.writeBuffer(this.uniformBuffer, 128, <ArrayBuffer>projection);

        // Setup render pipeline
        const bindGroupLayout = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {}
                }
            ],
        });
        
        const bindGroup = device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.uniformBuffer
                    }
                }
            ]
        });
        
        const pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]
        });
        
        const pipeline = device.createRenderPipeline({
            vertex : {
                module : device.createShaderModule({
                    code : shader
                }),
                entryPoint : "vs_main",
                buffers: [vertBufLayout]
            },
    
            fragment : {
                module : device.createShaderModule({
                    code : shader
                }),
                entryPoint : "fs_main",
                targets : [{
                    format : format
                }]
            },
    
            primitive : {
                topology : "triangle-list"
            },
    
            layout: pipelineLayout
        });

        this.pipeline = pipeline;
        this.bindGroup = bindGroup;
    }


    render = () =>
    {
        const device = this.gpu.device;
        const context = this.gpu.context;
        const commandEncoder = device.createCommandEncoder({label: "My encoder"});
        
        const textureView : GPUTextureView = context.getCurrentTexture().createView();
        const renderpass : GPURenderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: {r: 0.5, g: 0.4, b: 0.3, a: 1.0},
                loadOp: "clear",
                storeOp: "store"
            }]
        });
        renderpass.setPipeline(this.pipeline!);
        renderpass.setBindGroup(0, this.bindGroup!);
        renderpass.setVertexBuffer(0, this.vertexBuffer!);
        renderpass.setIndexBuffer(this.indexBuffer!, "uint16");
        renderpass.drawIndexed(36);
        renderpass.end();

        const commandBuffer = commandEncoder.finish();

        device.queue.submit([commandBuffer]);

        requestAnimationFrame(this.render);
    }

}
