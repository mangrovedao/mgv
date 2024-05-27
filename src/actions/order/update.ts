import type { Client, SimulateContractReturnType } from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type RawSetExpirationParams,
  type SetExpirationParams,
  type UpdateOrderByTickParams,
  type UpdateOrderByVolumeParams,
  type UpdateOrderParams,
  rawSetExpirationParams,
  setExpirationParams,
  type updateOrderABI,
  updateOrderByTickParams,
  updateOrderByVolumeParams,
  updateOrderParams,
} from '../../builder/order/update.js'
import type {
  BuiltArgs,
  BuiltArgsWithValue,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import type { Prettify } from '../../types/lib.js'
import { getAction } from '../../utils/getAction.js'
import {
  type GetLimitOrderStepsArgs,
  type GetLimitOrderStepsParams,
  getLimitOrderSteps,
} from './new.js'

export type GetUpdateOrderStepsParams = GetLimitOrderStepsParams
export type GetUpdateOrderStepsArgs = GetLimitOrderStepsArgs

export const getUpdateOrderSteps = getLimitOrderSteps

type UpdateSimulationParams = SimulationParams<
  typeof updateOrderABI,
  'updateOffer'
>

export type SimulateUpdateOrderByTickArgs = Prettify<
  UpdateOrderByTickParams & Omit<UpdateSimulationParams, BuiltArgsWithValue>
>

export type SimulateUpdateOrderResult = Omit<
  Prettify<SimulateContractReturnType<typeof updateOrderABI, 'updateOffer'>>,
  'result'
>

export async function simulateUpdateOrderByTick(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateUpdateOrderByTickArgs,
): Promise<SimulateUpdateOrderResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as UpdateSimulationParams),
    address: actionParams.mgvOrder,
    ...updateOrderByTickParams(args),
  })
  return { request }
}

export type SimulateUpdateOrderByVolumeArgs = Prettify<
  UpdateOrderByVolumeParams & Omit<UpdateSimulationParams, BuiltArgsWithValue>
>

export async function simulateUpdateOrderByVolume(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateUpdateOrderByVolumeArgs,
): Promise<SimulateUpdateOrderResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as UpdateSimulationParams),
    address: actionParams.mgvOrder,
    ...updateOrderByVolumeParams(args),
  })
  return { request }
}

export type SimulateUpdateOrderArgs = Prettify<
  UpdateOrderParams & Omit<UpdateSimulationParams, BuiltArgsWithValue>
>

export async function simulateUpdateOrder(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: SimulateUpdateOrderArgs,
): Promise<SimulateUpdateOrderResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as UpdateSimulationParams),
    address: actionParams.mgvOrder,
    ...updateOrderParams(market, args),
  })
  return { request }
}

type SetExpirationSimulationParams = SimulationParams<
  typeof updateOrderABI,
  'setReneging'
>

export type SimulateSetRawExpirationArgs = Prettify<
  RawSetExpirationParams & Omit<SetExpirationSimulationParams, BuiltArgs>
>

export type SimulateSetExpirationResult = {
  request: SimulateContractReturnType<
    typeof updateOrderABI,
    'setReneging'
  >['request']
}

export async function simulateSetRawExpiration(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateSetRawExpirationArgs,
): Promise<SimulateSetExpirationResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SetExpirationSimulationParams),
    address: actionParams.mgvOrder,
    ...rawSetExpirationParams(args),
  })
  return { request }
}

export type SimulateSetExpirationArgs = Prettify<
  SetExpirationParams & Omit<SetExpirationSimulationParams, BuiltArgs>
>

export async function simulateSetExpiration(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: SimulateSetExpirationArgs,
): Promise<SimulateSetExpirationResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SetExpirationSimulationParams),
    address: actionParams.mgvOrder,
    ...setExpirationParams(market, args),
  })
  return { request }
}
