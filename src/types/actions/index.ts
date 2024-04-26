import type { Address } from 'viem'

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
 * The parameters for a token.
 * @param address The address of the token.
 * @param decimals The number of decimals of the token.
 */
export type Token = {
  address: Address
  decimals: number
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
