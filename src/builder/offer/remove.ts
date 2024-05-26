import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BS } from '../../lib/enums.js'
import type { MarketParams } from '../../types/actions/index.js'
import type { OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const retractOfferABI = parseAbi([
  olKeyABIRaw,
  'function retractOffer(OLKey memory olKey, uint offerId, bool deprovision) external returns (uint provision)',
])

export type RawRetractOfferParams = {
  olKey: OLKey
  offerId: bigint
  deprovision?: boolean | undefined
}

export function rawRetractOfferParams(params: RawRetractOfferParams) {
  const { olKey, offerId, deprovision = true } = params
  return {
    abi: retractOfferABI,
    functionName: 'retractOffer',
    args: [olKey, offerId, deprovision],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof retractOfferABI,
      'nonpayable',
      'retractOffer'
    >,
    'address'
  >
}

export type RetractOfferParams = {
  offerId: bigint
  bs: BS
  deprovision?: boolean | undefined
}

export function retractOfferParams(
  market: MarketParams,
  params: RetractOfferParams,
) {
  const olKey: OLKey = {
    outbound_tkn:
      params.bs === BS.buy ? market.quote.address : market.base.address,
    inbound_tkn:
      params.bs === BS.buy ? market.base.address : market.quote.address,
    tickSpacing: market.tickSpacing,
  }
  return rawRetractOfferParams({
    olKey,
    ...params,
  })
}
