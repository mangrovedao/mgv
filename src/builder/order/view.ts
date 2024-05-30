import { type Address, type ContractFunctionParameters, parseAbi } from 'viem'
import { hash } from '../../lib/ol-key.js'
import type { OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const mgvOrderViewABI = parseAbi([
  olKeyABIRaw,
  'struct Condition {uint160 date;uint96 volume;}',
  'function reneging(bytes32 olKeyHash, uint offerId) public view returns (Condition memory)',
  'function provisionOf(OLKey memory olKey, uint offerId) external view returns (uint provision)',
])

export const smartRouterViewABI = parseAbi([
  'struct RoutingOrder {address token;bytes32 olKeyHash;uint offerId;address fundOwner;}',
  'function getLogic(RoutingOrder calldata routingOrder) external view returns (address)',
])

export type ViewLimitOrderParams = {
  olKey: OLKey
  offerId: bigint
}

export function viewExpirationParams(params: ViewLimitOrderParams) {
  return {
    abi: mgvOrderViewABI,
    functionName: 'reneging',
    args: [hash(params.olKey), params.offerId],
  } satisfies Omit<
    ContractFunctionParameters<typeof mgvOrderViewABI, 'view', 'reneging'>,
    'address'
  >
}

export function viewProvisionParams(params: ViewLimitOrderParams) {
  return {
    abi: mgvOrderViewABI,
    functionName: 'provisionOf',
    args: [params.olKey, params.offerId],
  } satisfies Omit<
    ContractFunctionParameters<typeof mgvOrderViewABI, 'view', 'provisionOf'>,
    'address'
  >
}

export type ViewLimitOrderLogicsParams = {
  olKey: OLKey
  offerId: bigint
  user: Address
  token: Address
}

export function viewLimitOrderLogicsParams(params: ViewLimitOrderLogicsParams) {
  return {
    abi: smartRouterViewABI,
    functionName: 'getLogic',
    args: [
      {
        token: params.token,
        olKeyHash: hash(params.olKey),
        offerId: params.offerId,
        fundOwner: params.user,
      },
    ],
  } satisfies Omit<
    ContractFunctionParameters<typeof smartRouterViewABI, 'view', 'getLogic'>,
    'address'
  >
}
