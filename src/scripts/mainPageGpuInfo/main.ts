import { GPUSetup } from "../../GPUSetup";

const gpu = await GPUSetup.build("dummy-canvas");
gpu.listGPUInfo();