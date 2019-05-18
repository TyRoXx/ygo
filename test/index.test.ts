import { Printer } from "../src/index";
import * as testing from "./testing";

let a = new Printer(30);
a.print();

testing.assert(true)
