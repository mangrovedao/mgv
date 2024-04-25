import type { CompleteOffer, LocalConfig, GlobalConfig } from "../lib.js";

/**
 * GetBookParams
 * @param depth the depth of the book for each side
 */
export type BookParams = {
  depth?: bigint;
}

/**
 * The book object
 * @param asks the asks
 * @param bids the bids
 * @param asksConfig the asks semibook configuration
 * @param bidsConfig the bids semibook configuration
 * @param marketConfig the global mangrove configuration
 */
export type Book = {
  asks: CompleteOffer[];
  bids: CompleteOffer[];
  asksConfig: LocalConfig;
  bidsConfig: LocalConfig;
  marketConfig: GlobalConfig;
};
