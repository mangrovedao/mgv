import {
  type ContractFunctionParameters,
  type ContractFunctionReturnType,
  parseAbi,
} from 'viem'
import type { BA } from '../lib/enums.js'
import { rpcOfferToHumanOffer } from '../lib/human-readable.js'
import { unpackOfferDetail } from '../lib/offer-detail.js'
import { unpackOffer } from '../lib/offer.js'
import type { CompleteOffer, OLKey } from '../types/lib.js'
import { olKeyABIRaw } from './structs.js'

export const packedOfferListABI = parseAbi([
  olKeyABIRaw,
  'function packedOfferList(OLKey memory olKey, uint fromId, uint maxOffers) public view returns (uint, uint[] memory offerIDs, uint[] memory offersPacked, uint[] memory OfferDetailsPacked)',
])

/**
 * Parameters for getting a book.
 * @param olKey the OLKey object
 * @param fromId the id to start from
 * @param maxOffers the maximum number of offers to get
 */
export type GetBookParams = {
  olKey: OLKey
  fromId?: bigint
  maxOffers?: bigint
}

/**
 *
 * @param params get book params
 * @returns the parameters for getting a book for viem
 * @example
 *
 * ```ts
 * const rawBook = await walletClient.readContract({
 *   address: MANGROVE_READER,
 *   ...getBookParams({
 *     ...
 *   })
 * });
 * ```
 */
export function getBookParams(params: GetBookParams) {
  return {
    abi: packedOfferListABI,
    functionName: 'packedOfferList',
    args: [params.olKey, params.fromId ?? 0n, params.maxOffers ?? 100n],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof packedOfferListABI,
      'view',
      'packedOfferList'
    >,
    'address'
  >
}

export type ParseBookParams = {
  result: ContractFunctionReturnType<
    typeof packedOfferListABI,
    'view',
    'packedOfferList'
  >
  ba: BA
  baseDecimals: number
  quoteDecimals: number
}

/**
 *
 * @param result the result of the packedOfferList function
 * @returns the parsed book result
 * @example
 *
 * ```ts
 * const rawBook = await walletClient.readContract({
 *   address: MANGROVE_READER,
 *   ...getBookParams({
 *     ...
 *   })
 * });
 *
 * const book = parseBookResult(rawBook);
 * ```
 */
export function parseBookResult({
  result,
  ba,
  baseDecimals,
  quoteDecimals,
}: ParseBookParams): CompleteOffer[] {
  const [_, offerIDs, offersPacked, offerDetailsPacked] = result
  return offerIDs.map((id, i) => {
    const offer = unpackOffer(offersPacked[i])
    const detail = unpackOfferDetail(offerDetailsPacked[i])
    const humanReadableParams = rpcOfferToHumanOffer({
      ...offer,
      ba,
      baseDecimals,
      quoteDecimals,
    })
    return {
      id,
      offer,
      detail,
      ...humanReadableParams,
    }
  })
}
