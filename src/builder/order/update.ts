import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BS } from '../../lib/enums.js'
import { hash } from '../../lib/ol-key.js'
import { tickFromVolumes } from '../../lib/tick.js'
import type { Book } from '../../types/actions/book.js'
import type { MarketParams } from '../../types/actions/index.js'
import type { GlobalConfig, LocalConfig, OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const updateOrderABI = parseAbi([
  olKeyABIRaw,
  'function updateOffer(OLKey memory olKey, int tick, uint gives, uint gasreq, uint offerId) external payable',
  'function setReneging(bytes32 olKeyHash, uint offerId, uint expiryDate, uint volume) external',
])

export type UpdateOrderByTickParams = {
  olKey: OLKey
  tick: bigint
  gives: bigint
  restingOrderGasreq: bigint
  offerId: bigint
  localConfig: LocalConfig
  globalConfig: GlobalConfig
}

export function updateOrderByTickParams(params: UpdateOrderByTickParams) {
  const { olKey, tick, gives, restingOrderGasreq, offerId } = params
  const value =
    (restingOrderGasreq + params.localConfig.offer_gasbase) *
    params.globalConfig.gasprice *
    BigInt(1e6)
  return {
    abi: updateOrderABI,
    functionName: 'updateOffer',
    args: [olKey, tick, gives, restingOrderGasreq, offerId],
    value,
  } satisfies Omit<
    ContractFunctionParameters<typeof updateOrderABI, 'payable', 'updateOffer'>,
    'address'
  > & { value: bigint }
}

export type UpdateOrderByVolumeParams = {
  olKey: OLKey
  gives: bigint
  wants: bigint
  restingOrderGasreq: bigint
  offerId: bigint
  localConfig: LocalConfig
  globalConfig: GlobalConfig
}

export function updateOrderByVolumeParams(params: UpdateOrderByVolumeParams) {
  const tick = tickFromVolumes(params.wants, params.gives)
  return updateOrderByTickParams({ ...params, tick })
}

export type UpdateOrderParams = {
  baseAmount: bigint
  quoteAmount: bigint
  restingOrderGasreq: bigint
  bs: BS
  book: Book
  offerId: bigint
}

export function updateOrderParams(
  market: MarketParams,
  params: UpdateOrderParams,
) {
  const { baseAmount, quoteAmount, restingOrderGasreq, bs, book, offerId } =
    params
  const { base, quote, tickSpacing } = market
  const gives = bs === BS.buy ? quoteAmount : baseAmount
  const wants = bs === BS.buy ? baseAmount : quoteAmount
  const localConfig = bs === BS.buy ? book.bidsConfig : book.asksConfig
  const olKey: OLKey =
    bs === BS.buy
      ? { outbound_tkn: quote.address, inbound_tkn: base.address, tickSpacing }
      : { outbound_tkn: base.address, inbound_tkn: quote.address, tickSpacing }
  return updateOrderByVolumeParams({
    olKey,
    gives,
    wants,
    restingOrderGasreq,
    offerId,
    localConfig,
    globalConfig: book.marketConfig,
  })
}

export type RawSetExpirationParams = {
  olKey: OLKey
  offerId: bigint
  expiryDate: bigint
}

export function rawSetExpirationParams(params: RawSetExpirationParams) {
  return {
    abi: updateOrderABI,
    functionName: 'setReneging',
    args: [hash(params.olKey), params.offerId, params.expiryDate, 0n],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof updateOrderABI,
      'nonpayable',
      'setReneging'
    >,
    'address'
  >
}

export type SetExpirationParams = {
  bs: BS
  offerId: bigint
  expiryDate: bigint
}

export function setExpirationParams(
  market: MarketParams,
  params: SetExpirationParams,
) {
  const { bs, offerId, expiryDate } = params
  const { base, quote, tickSpacing } = market
  const olKey: OLKey =
    bs === BS.buy
      ? { outbound_tkn: quote.address, inbound_tkn: base.address, tickSpacing }
      : { outbound_tkn: base.address, inbound_tkn: quote.address, tickSpacing }
  return rawSetExpirationParams({ olKey, offerId, expiryDate })
}
