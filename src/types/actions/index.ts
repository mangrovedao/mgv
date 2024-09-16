import type { Address } from 'viem'
import type { Token } from '../../addresses/tokens/utils.js'

/**
 * The parameters for the Mangrove actions.
 * @param mgv The address of the Mangrove contract.
 * @param mgvReader The address of the Mangrove reader contract.
 * @param mgvOrder The address of the Mangrove order contract.
 */
export type MangroveActionsDefaultParams = {
  mgv: Address
  mgvReader: Address
  mgvOrder: Address
  routerProxyFactory: Address
  smartRouter: Address
}

/**
 *
 * The parameters for a given market market
 * @param base The base token
 * @param quote The quote token
 * @param tickSpacing The tick spacing
 */
export type MarketParams = {
  base: Token
  quote: Token
  tickSpacing: bigint
}

/**
 *
 * The parameters for a given market market
 * @param tkn0 The base token
 * @param tkn1 The quote token
 * @param tickSpacing The tick spacing
 */
export type BaseMarket = {
  tkn0: { token: Address; decimals: number; symbol: string }
  tkn1: { token: Address; decimals: number; symbol: string }
  tickSpacing: bigint
}

/**
 * A serializable version of a market
 * @param base The base token
 * @param quote The quote token
 * @param tickSpacing The tick spacing
 */
export type SerializableMarketParams = {
  base: Token
  quote: Token
  tickSpacing: number
}

/**
 * List of args that are built by the transaction builders
 */
export type BuiltArgs = 'address' | 'abi' | 'functionName' | 'args'

/**
 * List of args that are built by the transaction builders with a value
 */
export type BuiltArgsWithValue = BuiltArgs | 'value'

// book

export type {
  BookParams,
  Book,
} from './book.js'

// market order

export type { MarketOrderResult } from './market-order.js'

// offer

export type {
  NewOfferResult,
  UpdateOfferResult,
  RetractOfferResult,
} from './offer.js'

// steps

export type {
  MarketOrderSteps,
  LimitOrderSteps,
  NewOfferSteps,
  AmplifiedOrderSteps,
  KandelSteps,
  SmartKandelSteps,
} from './steps.js'
