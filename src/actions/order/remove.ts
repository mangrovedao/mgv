import type {
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
} from 'viem'
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
import { getAction } from '../../utils/getAction.js'

type SimulationParams = SimulateContractParameters<
  typeof retractOrderABI,
  'retractOffer'
>

export type SimulateRawRemoveOrderArgs = Prettify<
  RawRemoveOrderParams & Omit<SimulationParams, BuiltArgs>
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
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...rawRemoveOrderParams(args),
  })
  return { provision: result, request }
}

export type SimulateRemoveOrderArgs = Prettify<
  RemoveOrderParams & Omit<SimulationParams, BuiltArgs>
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
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...removeOrderParams(market, args),
  })
  return { provision: result, request }
}
