import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BS } from '../../lib/enums.js'
import { tickFromVolumes } from '../../lib/tick.js'
import type { Book } from '../../types/actions/book.js'
import type { MarketParams } from '../../types/actions/index.js'
import type { GlobalConfig, LocalConfig, OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const newOfferByTickABI = parseAbi([
  olKeyABIRaw,
  'function newOfferByTick(OLKey memory olKey, int tick, uint gives, uint gasreq, uint gasprice) public payable returns (uint offerId)',
])

/**
 * Parameters for a new offer by tick.
 * @param olKey the OLKey object
 * @param tick the tick for the offer (price)
 * @param gives the amount of outbound to give
 * @param gaspriceOverride the gasprice for the offer
 * @param globalConfig the global config
 * @param localConfig the local config of the market we want to sell on
 */
export type NewOfferByTickParams = {
  olKey: OLKey
  tick: bigint
  gives: bigint
  gaspriceOverride?: bigint
  globalConfig: GlobalConfig
  localConfig: LocalConfig
}

/**
 *
 * @param params the parameters for the new offer by tick
 * @returns the parameters for the new offer by tick
 */
export function newOfferByTickParams(params: NewOfferByTickParams) {
  const {
    olKey,
    tick,
    gives,
    gaspriceOverride = 0n,
    globalConfig: { gasprice },
    localConfig: { offer_gasbase },
  } = params
  const gasPriceForValue = gaspriceOverride === 0n ? gasprice : gaspriceOverride
  const value = offer_gasbase * gasPriceForValue * BigInt(1e6)
  return {
    abi: newOfferByTickABI,
    functionName: 'newOfferByTick',
    args: [olKey, tick, gives, 0n, gaspriceOverride],
    value,
  } satisfies Omit<
    ContractFunctionParameters<
      typeof newOfferByTickABI,
      'payable',
      'newOfferByTick'
    >,
    'address'
  > & { value: bigint }
}

/**
 * Parameters for a new offer by volume.
 * @param olKey the OLKey object
 * @param gives the amount of outbound to give
 * @param wants the amount of inbound to receive
 * @param gaspriceOverride the gasprice for the offer
 * @param globalConfig the global config
 * @param localConfig the local config of the market we want to sell on
 */
export type NewOfferByVolumeParams = {
  olKey: OLKey
  gives: bigint
  wants: bigint
  gaspriceOverride?: bigint
  globalConfig: GlobalConfig
  localConfig: LocalConfig
}

/**
 *
 * @param params the parameters for the new offer by volume
 * @returns the parameters for the new offer by volume
 */
export function newOfferByVolumeParams(params: NewOfferByVolumeParams) {
  const tick = tickFromVolumes(params.wants, params.gives)
  return newOfferByTickParams({ ...params, tick })
}

/**
 * Parameters for a new offer.
 * @param baseAmount the amount of base token to give
 * @param quoteAmount the amount of quote token to receive
 * @param bs the buy or sell side
 * @param book the book to post the order on
 */
export type NewOfferParams = {
  baseAmount: bigint
  quoteAmount: bigint
  bs: BS
  book: Book
}

/**
 *
 * @param market the market parameters
 * @param params the parameters for the new offer
 * @returns the parameters for the new offer
 */
export function newOfferParams(market: MarketParams, params: NewOfferParams) {
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
  return newOfferByVolumeParams({
    olKey,
    gives,
    wants,
    globalConfig: book.marketConfig,
    localConfig,
  })
}
