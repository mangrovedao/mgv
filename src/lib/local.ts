import type { LocalConfig } from '../types/lib.js'
import { parseDensity } from './density.js'
import { decodeBigintsFromBigint } from './utils.js'

// number of bits in each field
const active_bits = 1n
const fee_bits = 8n
const density_bits = 9n
const binPosInLeaf_bits = 2n
const level3_bits = 64n
const level2_bits = 64n
const level1_bits = 64n
const root_bits = 2n
const kilo_offer_gasbase_bits = 9n
const lock_bits = 1n
const last_bits = 32n

export function unpackLocalConfig(_config: bigint): LocalConfig {
  const [
    active,
    fee,
    density,
    binPosInLeaf,
    level3,
    level2,
    level1,
    root,
    kilo_offer_gasbase,
    lock,
    last,
  ] = decodeBigintsFromBigint(_config, [
    active_bits,
    fee_bits,
    density_bits,
    binPosInLeaf_bits,
    level3_bits,
    level2_bits,
    level1_bits,
    root_bits,
    kilo_offer_gasbase_bits,
    lock_bits,
    last_bits,
  ])
  return {
    active: active === 1n,
    fee,
    density: parseDensity(density),
    binPosInLeaf,
    level3,
    level2,
    level1,
    root,
    offer_gasbase: kilo_offer_gasbase * 1000n,
    lock: lock === 1n,
    last,
  }
}
