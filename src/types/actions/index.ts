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
} from './steps.js'
