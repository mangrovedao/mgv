import { getAddress, toHex } from "viem";
import type { GlobalConfig } from "../types/lib.js";
import { mask } from "./utils.js";

// number of bits in each field
const monitor_bits = 160n;
const useOracle_bits = 1n;
const notify_bits = 1n;
const gasprice_bits = 26n;
const gasmax_bits = 24n;
const dead_bits = 1n;
const maxRecursionDepth_bits = 8n;
const maxGasreqForFailingOffers_bits = 32n;

const unused_bits =
  256n -
  monitor_bits -
  useOracle_bits -
  notify_bits -
  gasprice_bits -
  gasmax_bits -
  dead_bits -
  maxRecursionDepth_bits -
  maxGasreqForFailingOffers_bits;

export function unpackGlobalConfig(_config: bigint): GlobalConfig {
  let config = _config >> unused_bits;
  const maxGasreqForFailingOffers =
    config & mask(maxGasreqForFailingOffers_bits);
  config >>= maxGasreqForFailingOffers_bits;
  const maxRecursionDepth = config & mask(maxRecursionDepth_bits);
  config >>= maxRecursionDepth_bits;
  const dead = config & mask(dead_bits);
  config >>= dead_bits;
  const gasmax = config & mask(gasmax_bits);
  config >>= gasmax_bits;
  const gasprice = config & mask(gasprice_bits);
  config >>= gasprice_bits;
  const notify = config & mask(notify_bits);
  config >>= notify_bits;
  const useOracle = config & mask(useOracle_bits);
  config >>= useOracle_bits;
  const monitor = getAddress(toHex(config & mask(monitor_bits), { size: 20 }));
  return {
    monitor,
    useOracle: useOracle === 1n,
    notify: notify === 1n,
    gasprice,
    gasmax,
    dead: dead === 1n,
    maxRecursionDepth,
    maxGasreqForFailingOffers,
  };
}
