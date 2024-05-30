import { type ContractFunctionParameters, parseAbi } from 'viem'
import type { OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

// given a market and offer id return:
// - offer
// - offer details

export const mgvViewABI = parseAbi([
  olKeyABIRaw,
  'function offerData(OLKey memory olKey, uint offerId) external view returns (uint offer, uint offerDetail)',
])

export type ViewOfferParams = {
  olKey: OLKey
  offerId: bigint
}

export function viewOfferParams(params: ViewOfferParams) {
  return {
    abi: mgvViewABI,
    functionName: 'offerData',
    args: [params.olKey, params.offerId],
  } satisfies Omit<
    ContractFunctionParameters<typeof mgvViewABI, 'view', 'offerData'>,
    'address'
  >
}
