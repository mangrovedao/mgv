import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BS } from '../../lib/enums.js'
import type { MarketParams } from '../../types/actions/index.js'
import type { OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const retractOrderABI = parseAbi([
  olKeyABIRaw,
  'function retractOffer(OLKey memory olKey, uint offerId, bool deprovision) external returns (uint freeWei)',
])

export type RawRemoveOrderParams = {
  olKey: OLKey
  offerId: bigint
  deprovision?: boolean | undefined
}

export function rawRemoveOrderParams(params: RawRemoveOrderParams) {
  const { olKey, offerId, deprovision = true } = params
  return {
    abi: retractOrderABI,
    functionName: 'retractOffer',
    args: [olKey, offerId, deprovision],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof retractOrderABI,
      'nonpayable',
      'retractOffer'
    >,
    'address'
  >
}

export type RemoveOrderParams = {
  bs: BS
  offerId: bigint
  deprovision?: boolean | undefined
}

export function removeOrderParams(
  market: MarketParams,
  params: RemoveOrderParams,
) {
  const olKey: OLKey = {
    outbound_tkn:
      params.bs === BS.buy ? market.quote.address : market.base.address,
    inbound_tkn:
      params.bs === BS.buy ? market.base.address : market.quote.address,
    tickSpacing: market.tickSpacing,
  }
  return rawRemoveOrderParams({
    olKey,
    ...params,
  })
}
