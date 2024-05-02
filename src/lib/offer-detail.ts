import { getAddress, toHex } from 'viem'
import type { RpcOfferDetail } from '../types/lib.js'
import { mask } from './utils.js'

const maker_bits = 160n
const gasreq_bits = 24n
const kilo_offer_gasbase_bits = 9n
const gasprice_bits = 26n

const unused_bits =
  256n - maker_bits - gasreq_bits - kilo_offer_gasbase_bits - gasprice_bits

export function unpackOfferDetail(_offerDetail: bigint): RpcOfferDetail {
  let offerDetail = _offerDetail >> unused_bits
  const gasprice = offerDetail & mask(gasprice_bits)
  offerDetail >>= gasprice_bits
  const kilo_offer_gasbase = offerDetail & mask(kilo_offer_gasbase_bits)
  offerDetail >>= kilo_offer_gasbase_bits
  const gasreq = offerDetail & mask(gasreq_bits)
  offerDetail >>= gasreq_bits
  const maker = getAddress(toHex(offerDetail & mask(maker_bits), { size: 20 }))
  return {
    maker,
    gasreq,
    kilo_offer_gasbase,
    gasprice,
  }
}
