import type { Address, Client, SimulateContractReturnType } from 'viem'
import {
  type ReadContractParameters,
  readContract,
  simulateContract,
} from 'viem/actions'
import {
  type BindParams,
  type DeployRouterParams,
  type GetUserRouterParams,
  type IsBoundParams,
  bindParams,
  deployRouterParams,
  getUserRouterParams,
  isBoundParams,
  type routerProxyFactoryABI,
  type smartRouterABI,
} from '../builder/smart-router.js'
import type {
  BuiltArgs,
  MangroveActionsDefaultParams,
} from '../types/actions/index.js'
import type { SimulationParams } from '../types/actions/simulation.js'
import { getAction } from '../utils/getAction.js'

export type GetUserRouterArgs = GetUserRouterParams &
  Omit<
    ReadContractParameters<typeof routerProxyFactoryABI, 'computeProxyAddress'>,
    BuiltArgs
  >

export async function getUserRouter(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: GetUserRouterArgs,
) {
  return getAction(
    client,
    readContract,
    'readContract',
  )({
    ...getUserRouterParams(actionParams, args),
    address: actionParams.routerProxyFactory,
    ...args,
  })
}

export type IsBoundArgs = IsBoundParams &
  Omit<ReadContractParameters<typeof smartRouterABI, 'isBound'>, BuiltArgs>

export async function isBound(
  client: Client,
  router: Address,
  args: IsBoundArgs,
) {
  return getAction(
    client,
    readContract,
    'readContract',
  )({
    ...args,
    ...isBoundParams(args),
    address: router,
  })
}

type DeployRouterSimulationParams = SimulationParams<
  typeof routerProxyFactoryABI,
  'instantiate'
>

export type DeployRouterArgs = DeployRouterParams &
  Omit<DeployRouterSimulationParams, BuiltArgs>

export type DeployRouterResult = {
  router: Address
  created: boolean
  request: SimulateContractReturnType<
    typeof routerProxyFactoryABI,
    'instantiate'
  >['request']
}

export async function simulateDeployRouter(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: DeployRouterArgs,
) {
  const {
    request,
    result: [router, created],
  } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as DeployRouterSimulationParams),
    address: actionParams.routerProxyFactory,
    ...deployRouterParams(actionParams, args),
  })
  return {
    router,
    created,
    request,
  }
}

type BindSimulationParams = SimulationParams<typeof smartRouterABI, 'bind'>
export type BindArgs = BindParams & Omit<BindSimulationParams, BuiltArgs>
export type BindResult = SimulateContractReturnType<
  typeof smartRouterABI,
  'bind'
>

export async function simulateBind(
  client: Client,
  router: Address,
  args: BindArgs,
): Promise<BindResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as BindSimulationParams),
    address: router,
    ...bindParams(args),
  })
}
