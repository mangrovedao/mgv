import type { Book } from '../types/actions/book.js'
import type {
  GlobalConfig,
  LocalConfig,
  RpcCompleteOffer,
} from '../types/lib.js'
import { BS } from './enums.js'
import {
  MAX_TICK,
  inboundFromOutbound,
  outboundFromInbound,
  priceFromTick,
} from './tick.js'

/**
 * Parameters for a market order simulation.
 * @param orderBook the order book to simulate (this must be unsorted according to the returndata of getBook())
 * @param bs the buy/sell direction
 * @param fillVolume the volume to fill
 * @param fillWants if true, stops when fillVolume of outbound token is received, otherwise stops when fillVolume of inbound token is sent
 */
export type RawMarketOrderSimulationParams = {
  orderBook: RpcCompleteOffer[]
  localConfig: LocalConfig
  globalConfig: GlobalConfig
  fillVolume: bigint
  fillWants?: boolean | undefined
  maxTick?: bigint | undefined
}

/**
 * Result of a market order simulation.
 * @param totalGot the total amount of outbound token received
 * @param totalGave the total amount of inbound token sent
 * @param gas the total gas used
 * @param feePaid the total fee paid
 * @param maxTickEncountered the highest tick encountered
 */
export type RawMarketOrderSimulationResult = {
  totalGot: bigint
  totalGave: bigint
  gas: bigint
  feePaid: bigint
  maxTickEncountered: bigint
}

// if fillWants is true, stop when sum of gives is greater than fillVolume
// if fillWants is false, stop when sum of wants is greater than fillVolume

/**
 *
 * @param params The parameters for the market order simulation.
 * @returns the result of the market order simulation.
 */
export function rawMarketOrderSimulation(
  params: RawMarketOrderSimulationParams,
): RawMarketOrderSimulationResult {
  const {
    orderBook,
    fillVolume: _fillVolume,
    localConfig,
    globalConfig,
    fillWants = true,
    maxTick = MAX_TICK,
  } = params

  // if fillWants is true, then we need to multiply the fillVolume by 10_000n / (10_000n - fee) in order to account for the fee
  let fillVolume = fillWants
    ? (_fillVolume * 10_000n) / (10_000n - localConfig.fee)
    : _fillVolume

  const result: RawMarketOrderSimulationResult = {
    totalGot: 0n,
    totalGave: 0n,
    gas: 0n,
    feePaid: 0n,
    maxTickEncountered: orderBook.at(0)?.offer.tick || 0n,
  }

  for (
    let i = 0;
    i < orderBook.length &&
    fillVolume > 0n &&
    i < globalConfig.maxRecursionDepth;
    i++
  ) {
    const offer = orderBook[i]!
    if (offer.offer.tick > maxTick) break
    const maxGot = fillWants
      ? fillVolume
      : outboundFromInbound(offer.offer.tick, fillVolume)
    const got = maxGot < offer.offer.gives ? maxGot : offer.offer.gives
    const gave = inboundFromOutbound(offer.offer.tick, got)
    result.totalGot += got
    result.totalGave += gave
    result.gas += localConfig.offer_gasbase + offer.detail.gasreq
    result.maxTickEncountered = offer.offer.tick
    fillVolume -= fillWants ? got : gave
  }

  result.feePaid = (result.totalGot * localConfig.fee) / 10_000n
  result.totalGot -= result.feePaid

  return result
}

/**
 * Parameters for a market order simulation.
 * @param book the book to simulate
 * @param bs the buy/sell direction
 * @param base the base amount
 * @param quote the quote amount
 * @dev either base or quote must be specified
 */
export type MarketOrderSimulationParams = {
  book: Book
  bs: BS
} & (
  | {
      base: bigint
    }
  | {
      quote: bigint
    }
)

/**
 * Result of a market order simulation.
 * @param baseAmount the total amount of base received if buying, or sent if selling
 * @param quoteAmount the total amount of quote sent if buying, or received if selling
 * @param gas the total gas used
 * @param feePaid the total fee paid in the base token if buying, or quote token if selling
 * @param maxTickEncountered the highest tick encountered
 * @param minSlippage the minimum slippage to specify
 * @param price the price of the market order
 */
export type MarketOrderSimulationResult = {
  baseAmount: bigint
  quoteAmount: bigint
  gas: bigint
  feePaid: bigint
  maxTickEncountered: bigint
  minSlippage: number
  fillWants: boolean
  price: number
}

/**
 *
 * @param params the parameters for the market order simulation
 * @returns the result of the market order simulation
 */
export function marketOrderSimulation(
  params: MarketOrderSimulationParams,
): MarketOrderSimulationResult {
  const { book, bs } = params
  const globalConfig = book.marketConfig
  const fillVolume = 'base' in params ? params.base : params.quote

  // if we are buying, we are buying the base token and confronting the asks
  // if we are selling, we are selling the base token and confronting the bids
  const [orderBook, localConfig] =
    bs === BS.buy ? [book.asks, book.asksConfig] : [book.bids, book.bidsConfig]

  // if we are buying, we are buying the base token
  // so if we sepcify the base amount, we want to get this specific amount of base token
  // -------------------------------------
  // if we are selling, we are selling the base token
  // so if we sepcify the quote amount, we want to get this specific amount of quote token
  const fillWants =
    (bs === BS.buy && 'base' in params) || (bs === BS.sell && 'quote' in params)

  const raw = rawMarketOrderSimulation({
    orderBook,
    localConfig,
    globalConfig,
    fillVolume,
    fillWants,
  })

  // price is inbound / outbound <=> gave / got
  const price = Number(raw.totalGave) / Number(raw.totalGot)
  // convert maxTick to price
  const maxPriceEncountered = priceFromTick(raw.maxTickEncountered)
  // max_price = raw_price * (1 + slippage)
  // 1 + slippage = max_price / raw_price
  // slippage = max_price / raw_price - 1
  const slippage = maxPriceEncountered / price - 1

  return {
    baseAmount: BS.buy ? raw.totalGot : raw.totalGave,
    quoteAmount: BS.buy ? raw.totalGave : raw.totalGot,
    gas: raw.gas,
    feePaid: raw.feePaid,
    maxTickEncountered: raw.maxTickEncountered,
    minSlippage: slippage,
    price,
    fillWants,
  }
}
