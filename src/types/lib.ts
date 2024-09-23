import type { Address } from 'viem'
import type { BA } from '../lib/enums.js'

export type Prettify<T> = {
  [P in keyof T]: T[P]
}

/**
 * The global configuration of Mangrove.
 */
export type GlobalConfig = {
  monitor: Address
  useOracle: boolean
  notify: boolean
  gasprice: bigint
  gasmax: bigint
  dead: boolean
  maxRecursionDepth: bigint
  maxGasreqForFailingOffers: bigint
}

/**
 * The local configuration of the market.
 */
export type LocalConfig = {
  active: boolean
  fee: bigint
  density: number
  rawDensity: bigint
  binPosInLeaf: bigint
  level3: bigint
  level2: bigint
  level1: bigint
  root: bigint
  offer_gasbase: bigint
  lock: boolean
  last: bigint
}

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
 * An OLKey object that is serializable.
 * @param outbound_tkn The address of the outbound token.
 * @param inbound_tkn The address of the inbound token.
 * @param tickSpacing The tick spacing.
 */
export type SerializableOLKey = {
  outbound_tkn: Address
  inbound_tkn: Address
  tickSpacing: number
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
