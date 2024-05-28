import { type Address, type ContractFunctionParameters, parseAbi } from 'viem'
import type { MangroveActionsDefaultParams } from '../types/index.js'

export const routerProxyFactoryABI = parseAbi([
  'function computeProxyAddress(address owner, address routerImplementation) public view returns (address payable)',
  'function instantiate(address owner, address routerImplementation) public returns (address proxy, bool created)',
])

export const smartRouterABI = parseAbi([
  'function bind(address makerContract) public',
  'function admin() public view returns (address current)',
  'function isBound(address mkr) public view returns (bool)',
])

export type GetUserRouterParams = {
  user: Address
}

export function getUserRouterParams(
  actionParams: MangroveActionsDefaultParams,
  params: GetUserRouterParams,
) {
  return {
    abi: routerProxyFactoryABI,
    functionName: 'computeProxyAddress',
    args: [params.user, actionParams.smartRouter],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof routerProxyFactoryABI,
      'view',
      'computeProxyAddress'
    >,
    'address'
  >
}

export type IsBoundParams = {
  maker: Address
}

export function isBoundParams(params: IsBoundParams) {
  return {
    abi: smartRouterABI,
    functionName: 'isBound',
    args: [params.maker],
  } satisfies Omit<
    ContractFunctionParameters<typeof smartRouterABI, 'view', 'isBound'>,
    'address'
  >
}

export const adminParams = {
  abi: smartRouterABI,
  functionName: 'admin',
} satisfies Omit<
  ContractFunctionParameters<typeof smartRouterABI, 'view', 'admin'>,
  'address'
>

export type DeployRouterParams = {
  user: Address
}

export function deployRouterParams(
  actionParams: MangroveActionsDefaultParams,
  params: DeployRouterParams,
) {
  return {
    abi: routerProxyFactoryABI,
    functionName: 'instantiate',
    args: [params.user, actionParams.smartRouter],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof routerProxyFactoryABI,
      'nonpayable',
      'instantiate'
    >,
    'address'
  >
}

export type BindParams = {
  target: Address
}

export function bindParams(params: BindParams) {
  return {
    abi: smartRouterABI,
    functionName: 'bind',
    args: [params.target],
  } satisfies Omit<
    ContractFunctionParameters<typeof smartRouterABI, 'nonpayable', 'bind'>,
    'address'
  >
}
