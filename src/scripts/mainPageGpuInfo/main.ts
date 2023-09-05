import { GPUSetup } from "../../GPUSetup";

const gpu = await GPUSetup.build("dummy-canvas");
const info = await gpu.adapter.requestAdapterInfo();
(<HTMLLIElement> document.getElementById("architecture")).innerHTML = info.architecture;
(<HTMLLIElement> document.getElementById("description")).innerHTML = info.description;
(<HTMLLIElement> document.getElementById("device")).innerHTML = info.device;
(<HTMLLIElement> document.getElementById("vendor")).innerHTML = info.vendor;
//@ts-ignore missing in GPUAdapterInfo ?
(<HTMLLIElement> document.getElementById("driver")).innerHTML = info.driver;
