import { Hex } from "viem";
import { bytecode as mangrove } from "./mangrove.bytecode.js";
import { bytecode as mangroveReader } from "./mgv-reader.bytecode.js";
import { bytecode as mangroveOrder } from "./mgv-order.bytecode.js";
import { bytecode as routerProxyFactory } from "./router-proxy-factory.bytecode.js";

export async function getMangroveBytecodes() {
  return {
    mangrove: mangrove as Hex,
    mangroveReader: mangroveReader as Hex,
    mangroveOrder: mangroveOrder as Hex,
    routerProxyFactory: routerProxyFactory as Hex,
  };
}
