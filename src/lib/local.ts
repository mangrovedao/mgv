import type { LocalConfig } from '../types/lib.js'
import { parseDensity } from './density.js'
import { mask } from './utils.js'

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

const unused_bits =
  256n -
  active_bits -
  fee_bits -
  density_bits -
  binPosInLeaf_bits -
  level3_bits -
  level2_bits -
  level1_bits -
  root_bits -
  kilo_offer_gasbase_bits -
  lock_bits -
  last_bits

export function unpackLocalConfig(_config: bigint): LocalConfig {
  let config = _config >> unused_bits
  const last = config & mask(last_bits)
  config >>= last_bits
  const lock = config & mask(lock_bits)
  config >>= lock_bits
  const kilo_offer_gasbase = config & mask(kilo_offer_gasbase_bits)
  config >>= kilo_offer_gasbase_bits
  const root = config & mask(root_bits)
  config >>= root_bits
  const level1 = config & mask(level1_bits)
  config >>= level1_bits
  const level2 = config & mask(level2_bits)
  config >>= level2_bits
  const level3 = config & mask(level3_bits)
  config >>= level3_bits
  const binPosInLeaf = config & mask(binPosInLeaf_bits)
  config >>= binPosInLeaf_bits
  const rawDensity = config & mask(density_bits)
  const density = parseDensity(rawDensity)
  config >>= density_bits
  const fee = config & mask(fee_bits)
  config >>= fee_bits
  const active = config & mask(active_bits)
  return {
    active: active === 1n,
    fee,
    density,
    rawDensity,
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
