import type { RpcOffer } from '../types/lib.js'
import { mask } from './utils.js'
// import { decodeBigintsFromBigint } from "./utils.js";

const prev_bits = 32n
const next_bits = 32n
const tick_bits = 21n
const gives_bits = 127n

const unused_bits = 256n - prev_bits - next_bits - tick_bits - gives_bits

export function unpackOffer(offer: bigint): RpcOffer {
  let _offer = offer >> unused_bits
  const gives = _offer & mask(gives_bits)
  _offer >>= gives_bits
  const tick = BigInt.asIntN(Number(tick_bits), _offer & mask(tick_bits))
  _offer >>= tick_bits
  const next = _offer & mask(next_bits)
  _offer >>= next_bits
  const prev = _offer & mask(prev_bits)
  return {
    prev,
    next,
    tick,
    gives,
  }
}
