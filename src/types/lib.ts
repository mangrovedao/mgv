import type { Address, ContractFunctionReturnType } from 'viem'
import type { MgvReader } from '../abis/MgvReader.js'

export type Prettify<T> = {
  [P in keyof T]: T[P]
}

export type ReplaceKey<T, K extends keyof T, TReplace> = Prettify<
  Omit<T, K> & {
    [P in K]: TReplace
  }
>

/**
 * The global configuration of Mangrove.
 */
export type GlobalConfig = ContractFunctionReturnType<
  typeof MgvReader,
  'view',
  'globalUnpacked'
>

/**
 * The local configuration of the market.
 */
export type LocalConfig = Prettify<
  Omit<
    ReplaceKey<
      ContractFunctionReturnType<typeof MgvReader, 'view', 'localUnpacked'>,
      'density',
      number
    >,
    'kilo_offer_gasbase'
  > & {
    offer_gasbase: bigint
  }
>

/**
 * An OLKey object represents a pair of tokens and a tick spacing.
 * @param outbound_tkn The address of the outbound token.
 * @param inbound_tkn The address of the inbound token.
 * @param tickSpacing The tick spacing.
 */
export type OLKey = {
  outbound_tkn: Address
  inbound_tkn: Address
  tickSpacing: bigint
}
