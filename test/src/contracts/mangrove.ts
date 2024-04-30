import { Hex } from "viem";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { bytecode as mangrove } from "./mangrove.bytecode.js";
import { bytecode as mangroveReader } from "./mgv-reader.bytecode.js";
import { bytecode as mangroveOrder } from "./mgv-order.bytecode.js";
import { bytecode as routerProxyFactory } from "./router-proxy-factory.bytecode.js";

async function readBytecode(src: string): Promise<Hex> {
  // return file(join(import.meta.dir, src)).text() as any;
  const path = join(import.meta.url, "..", src);
  const data = await readFile(path);
  return data.toString() as Hex;
}

export async function getMangroveBytecodes() {
  return {
    mangrove: mangrove as Hex,
    mangroveReader: mangroveReader as Hex,
    mangroveOrder: mangroveOrder as Hex,
    routerProxyFactory: routerProxyFactory as Hex,
  };
}
