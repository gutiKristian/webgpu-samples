import { Application } from "../../Application";
import { SimpleTriangle } from "./BasicTriangle";

const app = await Application.build();
const program = new SimpleTriangle(app);
