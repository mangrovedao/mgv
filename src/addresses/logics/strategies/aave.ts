import { isAddressEqual, parseAbi, zeroAddress } from 'viem'
import { buildToken } from '../../tokens/utils.js'
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
      address: params.logic.logic,
      abi: aaveLogicABI,
      functionName: 'overlying',
      args: [params.token.address],
    }
  },
  parseOverlyingContractResponse(params, response) {
    return {
      type: 'erc20',
      overlying: buildToken({
        symbol: `${params.token.symbol} overlying`,
        address: response,
      }),
      available: !isAddressEqual(response, zeroAddress),
    }
  },
}

export const aaveBalance = baseBalance
