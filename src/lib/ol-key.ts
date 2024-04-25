import { type Address, type Hex, encodeAbiParameters, keccak256 } from 'viem'
import type { OLKey } from '../types/lib.js'

/**
 * Gets the OLKey from the other side of the market.
 * @param olKey the OLKey object
 * @returns the OLKey object with the outbound and inbound tokens swapped
 */
export function flip(olKey: OLKey): OLKey {
  return {
    outbound_tkn: olKey.inbound_tkn,
    inbound_tkn: olKey.outbound_tkn,
    tickSpacing: olKey.tickSpacing,
  }
}

/**
 * Hashes the OLKey object to obtain its unique 32 bytes identifier.
 * @param olKey the OLKey object
 * @returns the hash of the OLKey object
 */
export function hash(olKey: OLKey): Hex {
  // TODO: this can be changed to encode ABI parameters
  // and only include the ABI for ol key struct
  const bytes = encodeAbiParameters(
    [
      { name: 'outbound_tkn', type: 'address' },
      { name: 'inbound_tkn', type: 'address' },
      { name: 'tickSpacing', type: 'uint' },
    ],
    [olKey.outbound_tkn, olKey.inbound_tkn, olKey.tickSpacing],
  )
  return keccak256(bytes)
}

/**
 *
 * @param params.base the base token
 * @param params.quote the quote token
 * @param params.tickSpacing the tick spacing
 * @returns the OLKeys for the asks and bids market
 */
export function getSemibooksOLKeys(params: {
  base: Address
  quote: Address
  tickSpacing: bigint
}): {
  asksMarket: OLKey
  bidsMarket: OLKey
} {
  return {
    asksMarket: {
      outbound_tkn: params.base,
      inbound_tkn: params.quote,
      tickSpacing: params.tickSpacing,
    },
    bidsMarket: {
      outbound_tkn: params.quote,
      inbound_tkn: params.base,
      tickSpacing: params.tickSpacing,
    },
  }
}
