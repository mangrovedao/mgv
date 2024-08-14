import { type Address, type ContractFunctionParameters, parseAbi } from 'viem'

export type CheckAaveAssetParams = {
  token: Address
}

export const aaveRouterCheckAssetABI = parseAbi([
  'function checkAsset(address token) public view returns (bool)',
])

export function checkAaveAssetParams(params: CheckAaveAssetParams) {
  return {
    abi: aaveRouterCheckAssetABI,
    functionName: 'checkAsset',
    args: [params.token],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof aaveRouterCheckAssetABI,
      'view',
      'checkAsset'
    >,
    'address'
  >
}
