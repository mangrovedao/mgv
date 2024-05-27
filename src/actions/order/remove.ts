import type { Client, SimulateContractReturnType } from 'viem'
import { simulateContract } from 'viem/actions'
import type { Prettify } from 'viem/chains'
import {
  type RawRemoveOrderParams,
  type RemoveOrderParams,
  rawRemoveOrderParams,
  removeOrderParams,
  type retractOrderABI,
} from '../../builder/order/remove.js'
import type {
  BuiltArgs,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import { getAction } from '../../utils/getAction.js'

type RetractSimulationParams = SimulationParams<
  typeof retractOrderABI,
  'retractOffer'
>

export type SimulateRawRemoveOrderArgs = Prettify<
  RawRemoveOrderParams & Omit<RetractSimulationParams, BuiltArgs>
>

export type RetractOrderResult = {
  provision: bigint
  request: SimulateContractReturnType<
    typeof retractOrderABI,
    'retractOffer'
  >['request']
}

export async function simulateRawRemoveOrder(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateRawRemoveOrderArgs,
): Promise<RetractOrderResult> {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as RetractSimulationParams),
    address: actionParams.mgvOrder,
    ...rawRemoveOrderParams(args),
  })
  return { provision: result, request }
}

export type SimulateRemoveOrderArgs = Prettify<
  RemoveOrderParams & Omit<RetractSimulationParams, BuiltArgs>
>

export async function simulateRemoveOrder(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: SimulateRemoveOrderArgs,
): Promise<RetractOrderResult> {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as RetractSimulationParams),
    address: actionParams.mgvOrder,
    ...removeOrderParams(market, args),
  })
  return { provision: result, request }
}
