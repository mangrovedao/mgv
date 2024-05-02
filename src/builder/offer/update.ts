import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BS } from '../../lib/enums.js'
import { tickFromVolumes } from '../../lib/tick.js'
import type { Book } from '../../types/actions/book.js'
import type { MarketParams } from '../../types/actions/index.js'
import type { GlobalConfig, LocalConfig, OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const updateOfferByTickABI = parseAbi([
  olKeyABIRaw,
  'function updateOfferByTick(OLKey memory olKey, Tick tick, uint gives, uint gasreq, uint gasprice, uint offerId) public payable',
])

export type UpdateOfferByTickParams = {
  olKey: OLKey
  tick: bigint
  gives: bigint
  gaspriceOverride?: bigint
  offerId: bigint
  globalConfig: GlobalConfig
  localConfig: LocalConfig
}

export function updateOfferByTickParams(params: UpdateOfferByTickParams) {
  const {
    olKey,
    tick,
    gives,
    gaspriceOverride = 0n,
    globalConfig: { gasprice },
    localConfig: { offer_gasbase },
    offerId,
  } = params
  const gasPriceForValue = gaspriceOverride === 0n ? gasprice : gaspriceOverride
  const value = offer_gasbase * gasPriceForValue * BigInt(1e6)
  return {
    abi: updateOfferByTickABI,
    functionName: 'updateOfferByTick',
    args: [olKey, tick, gives, 0n, gaspriceOverride, offerId],
    value,
  } satisfies Omit<
    ContractFunctionParameters<
      typeof updateOfferByTickABI,
      'payable',
      'updateOfferByTick'
    >,
    'address'
  > & { value: bigint }
}

export type UpdateOfferByVolumeParams = {
  olKey: OLKey
  gives: bigint
  wants: bigint
  gaspriceOverride?: bigint
  offerId: bigint
  globalConfig: GlobalConfig
  localConfig: LocalConfig
}

export function updateOfferByVolumeParams(params: UpdateOfferByVolumeParams) {
  const tick = tickFromVolumes(params.wants, params.gives)
  return updateOfferByTickParams({ ...params, tick })
}

export type UpdateOfferParams = {
  offerId: bigint
  baseAmount: bigint
  quoteAmount: bigint
  bs: BS
  book: Book
}

export function updateOfferParams(
  market: MarketParams,
  params: UpdateOfferParams,
) {
  const { baseAmount, quoteAmount, bs, book } = params
  const {
    base: { address: baseToken },
    quote: { address: quoteToken },
    tickSpacing,
  } = market
  const [gives, wants, localConfig] =
    bs === BS.buy
      ? [quoteAmount, baseAmount, book.bidsConfig]
      : [baseAmount, quoteAmount, book.asksConfig]
  const olKey: OLKey = {
    outbound_tkn: bs === BS.buy ? quoteToken : baseToken,
    inbound_tkn: bs === BS.buy ? baseToken : quoteToken,
    tickSpacing,
  }
  return updateOfferByVolumeParams({
    olKey,
    gives,
    wants,
    offerId: params.offerId,
    globalConfig: book.marketConfig,
    localConfig,
  })
}
