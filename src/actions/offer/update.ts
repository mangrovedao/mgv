import type { Client, SimulateContractParameters } from 'viem'
import { simulateContract } from 'viem/actions'
import type { Prettify } from 'viem/chains'
import {
  type UpdateOfferByTickParams,
  type updateOfferByTickABI,
  updateOfferByTickParams,
} from '../../builder/offer/update.js'
import type {
  BuiltArgsWithValue,
  MangroveActionsDefaultParams,
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
