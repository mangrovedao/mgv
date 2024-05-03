import { parseAbi } from 'viem'
import type { RoutingLogicBalance } from '../utils.js'

export const balanceLogicABI = parseAbi([
  'function balanceLogic(address token, address fundOwner) external view returns (uint balance)',
])

export const baseBalance: RoutingLogicBalance<
  typeof balanceLogicABI,
  'view',
  'balanceLogic'
> = {
  getRoutingLogicBalanceParams(params) {
    return {
      address: params.logic,
      abi: balanceLogicABI,
      functionName: 'balanceLogic',
      args: [params.token, params.user],
    }
  },
  parseRoutingLogicBalanceResponse(response) {
    return response
  },
}
