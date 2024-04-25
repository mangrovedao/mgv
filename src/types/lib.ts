import type { Address, ContractFunctionReturnType } from 'viem'
import type { MgvReader } from '../abis/MgvReader.js'
import type { BA } from '../lib/enums.js'

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

export type CompleteToken = {
  address: Address
  decimals: number
}

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

/**
 * The offer object returned by the RPC endpoint.
 */
export type RpcOffer = {
  prev: bigint
  next: bigint
  tick: bigint
  gives: bigint
}

/**
 * The offer detail object returned by the RPC endpoint.
 */
export type RpcOfferDetail = {
  maker: Address
  gasreq: bigint
  kilo_offer_gasbase: bigint
  gasprice: bigint
}

/**
 * The complete offer object returned by the RPC endpoint.
 */
export type RpcCompleteOffer = {
  id: bigint
  offer: RpcOffer
  detail: RpcOfferDetail
}

/**
 * The complete offer object with price, volume and total for human readability.
 */
export type CompleteOffer = RpcCompleteOffer & {
  price: number
  volume: number
  total: number
  ba: BA
}
