import { toHex } from 'viem'
import type { GlobalConfig } from '../types/lib.js'
import { decodeBigintsFromBigint } from './utils.js'

// number of bits in each field
const monitor_bits = 160n
const useOracle_bits = 1n
const notify_bits = 1n
const gasprice_bits = 26n
const gasmax_bits = 24n
const dead_bits = 1n
const maxRecursionDepth_bits = 8n
const maxGasreqForFailingOffers_bits = 32n

export function unpackGlobalConfig(_config: bigint): GlobalConfig {
  const [
    monitor,
    useOracle,
    notify,
    gasprice,
    gasmax,
    dead,
    maxRecursionDepth,
    maxGasreqForFailingOffers,
  ] = decodeBigintsFromBigint(_config, [
    monitor_bits,
    useOracle_bits,
    notify_bits,
    gasprice_bits,
    gasmax_bits,
    dead_bits,
    maxRecursionDepth_bits,
    maxGasreqForFailingOffers_bits,
  ])
  return {
    monitor: toHex(monitor, { size: 20 }),
    useOracle: useOracle === 1n,
    notify: notify === 1n,
    gasprice,
    gasmax,
    dead: dead === 1n,
    maxRecursionDepth,
    maxGasreqForFailingOffers,
  }
}
