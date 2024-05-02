import type { Client, SimulateContractParameters } from 'viem'
import { simulateContract } from 'viem/actions'
import type { Prettify } from 'viem/chains'
import {
  type UpdateOfferByTickParams,
  type UpdateOfferByVolumeParams,
  type UpdateOfferParams,
  type updateOfferByTickABI,
  updateOfferByTickParams,
  updateOfferByVolumeParams,
  updateOfferParams,
} from '../../builder/offer/update.js'
import type {
  BuiltArgsWithValue,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { UpdateOfferResult } from '../../types/actions/offer.js'
import { getAction } from '../../utils/getAction.js'
import { type GetNewOfferStepsArgs, getNewOfferSteps } from './new.js'

export type GetUpdateOfferStepsArgs = GetNewOfferStepsArgs

export const getUpdateOfferSteps = getNewOfferSteps

type SimulationParams = SimulateContractParameters<
  typeof updateOfferByTickABI,
  'updateOfferByTick'
>

export type SimulateUpdateOfferByTickArgs = Prettify<
  UpdateOfferByTickParams & Omit<SimulationParams, BuiltArgsWithValue>
>

export async function simulateUpdateOfferByTick(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateUpdateOfferByTickArgs,
): Promise<UpdateOfferResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...updateOfferByTickParams(args),
  })
  return { request }
}

export type SimulateUpdateOfferByVolumeArgs = Prettify<
  UpdateOfferByVolumeParams & Omit<SimulationParams, BuiltArgsWithValue>
>

export async function simulateUpdateOfferByVolume(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateUpdateOfferByVolumeArgs,
): Promise<UpdateOfferResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...updateOfferByVolumeParams(args),
  })
  return { request }
}

export type SimulateUpdateOfferArgs = Prettify<
  UpdateOfferParams & Omit<SimulationParams, BuiltArgsWithValue>
>

export async function simulateUpdateOffer(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: SimulateUpdateOfferArgs,
): Promise<UpdateOfferResult> {
  const { request } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...updateOfferParams(market, args),
  })
  return { request }
}
