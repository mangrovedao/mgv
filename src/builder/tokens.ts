import { type Address, type ContractFunctionParameters, erc20Abi } from 'viem'
import type { MangroveActionsDefaultParams } from '../types/actions/index.js'

export type TokenAllowanceParams = {
  owner: Address
  spender: Address
  token: Address
}

export function tokenAllowanceParams(params: TokenAllowanceParams) {
  return {
    abi: erc20Abi,
    functionName: 'allowance',
    args: [params.owner, params.spender],
    address: params.token,
  } satisfies ContractFunctionParameters<typeof erc20Abi, 'view', 'allowance'>
}

export type MarketTokenAllowanceParams = {
  owner: Address
}

export function marketOrderTokenAllowanceParams(
  actionParams: MangroveActionsDefaultParams,
  params: MarketTokenAllowanceParams,
) {
  return {
    abi: erc20Abi,
    functionName: 'allowance',
    args: [params.owner, actionParams.mgv],
  } satisfies Omit<
    ContractFunctionParameters<typeof erc20Abi, 'view', 'allowance'>,
    'address'
  >
}
