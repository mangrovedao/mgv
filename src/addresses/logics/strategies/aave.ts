import { isAddressEqual, parseAbi, zeroAddress } from 'viem'
import type { RoutingLogicOverlying } from '../utils.js'
import { baseBalance } from './base.js'

export const aaveLogicABI = parseAbi([
  'function overlying(address asset) public view returns (address aToken)',
])

export const aaveOverLying: RoutingLogicOverlying<
  typeof aaveLogicABI,
  'view',
  'overlying'
> = {
  getOverlyingContractParams(params) {
    return {
      address: params.token,
      abi: aaveLogicABI,
      functionName: 'overlying',
      args: [params.token],
    }
  },
  parseOverlyingContractResponse(response) {
    return {
      type: 'erc20',
      overlying: response,
      available: !isAddressEqual(response, zeroAddress),
    }
  },
}

export const aaveBalance = baseBalance
