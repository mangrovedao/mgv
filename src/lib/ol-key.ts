import { type Hex, encodeFunctionResult, keccak256 } from 'viem'
import { IMangrove } from '../abis/IMangrove.js'
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
  const bytes = encodeFunctionResult({
    abi: IMangrove,
    functionName: 'olKeys',
    result: olKey,
  })
  return keccak256(bytes)
}
