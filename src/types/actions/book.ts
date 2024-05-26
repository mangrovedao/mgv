import type { CompleteOffer, GlobalConfig, LocalConfig } from '../lib.js'

/**
 * GetBookParams
 * @param depth the depth of the book for each side
 */
export type BookParams = {
  depth?: bigint | undefined
}

/**
 * The book object
 * @param asks the asks
 * @param bids the bids
 * @param asksConfig the asks semibook configuration
 * @param bidsConfig the bids semibook configuration
 * @param marketConfig the global mangrove configuration
 * @param midPrice the mid price
 * @param spread the spread
 * @param spreadPercent the spread percent
 */
export type Book = {
  asks: CompleteOffer[]
  bids: CompleteOffer[]
  asksConfig: LocalConfig
  bidsConfig: LocalConfig
  marketConfig: GlobalConfig
  midPrice: number
  spread: number
  spreadPercent: number
}
