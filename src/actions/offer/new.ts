import {
  type Address,
  type Client,
  type ReadContractParameters,
  type SimulateContractParameters,
  type erc20Abi,
  maxUint128,
  maxUint256,
} from 'viem'
import { readContract, simulateContract } from 'viem/actions'
import type { Prettify } from 'viem/chains'
import {
  type NewOfferByTickParams,
  type NewOfferByVolumeParams,
  type NewOfferParams,
  type newOfferByTickABI,
  newOfferByTickParams,
  newOfferByVolumeParams,
  newOfferParams,
} from '../../builder/offer/new.js'
import { tokenAllowanceParams } from '../../builder/tokens.js'
import { BS } from '../../lib/enums.js'
import type {
  BuiltArgs,
  BuiltArgsWithValue,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { NewOfferResult } from '../../types/actions/offer.js'
import type { NewOfferSteps } from '../../types/actions/steps.js'
import { getAction } from '../../utils/getAction.js'

export type GetNewOfferStepsParams = {
  user: Address
  bs: BS
  sendAmount?: bigint | undefined
}

export type GetNewOfferStepsArgs = Prettify<
  GetNewOfferStepsParams &
    Omit<ReadContractParameters<typeof erc20Abi, 'allowance'>, BuiltArgs>
>

export async function getNewOfferSteps(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: GetNewOfferStepsArgs,
): Promise<NewOfferSteps> {
  const { sendAmount: amount = maxUint256 } = args
  const tokenToApprove = args.bs === BS.buy ? market.quote : market.base

  const allowance = await getAction(
    client,
    readContract,
    'readContract',
  )({
    ...tokenAllowanceParams({
      owner: args.user,
      spender: actionParams.mgv,
      token: tokenToApprove.address,
    }),
    ...args,
  })

  return [
    {
      type: 'erc20Approval',
      params: {
        token: tokenToApprove,
        amount,
        from: args.user,
        spender: actionParams.mgv,
      },
      done: allowance >= amount || allowance >= maxUint128,
    },
  ]
}

type SimulationParams = SimulateContractParameters<
  typeof newOfferByTickABI,
  'newOfferByTick'
>

export type SimulateNewOfferByTickArgs = Prettify<
  NewOfferByTickParams & Omit<SimulationParams, BuiltArgsWithValue>
>

export async function simulateNewOfferByTick(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateNewOfferByTickArgs,
): Promise<NewOfferResult> {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...newOfferByTickParams({
      ...args,
    }),
    address: actionParams.mgv,
  })
  return {
    request,
    offerId: result,
  }
}

export type SimulateNewOfferByVolumeArgs = Prettify<
  NewOfferByVolumeParams & Omit<SimulationParams, BuiltArgsWithValue>
>

export async function simulateNewOfferByVolume(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateNewOfferByVolumeArgs,
) {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...newOfferByVolumeParams({
      ...args,
    }),
    address: actionParams.mgv,
  })
  return {
    request,
    offerId: result,
  }
}

export type SimulateNewOfferArgs = Prettify<
  NewOfferParams & Omit<SimulationParams, BuiltArgsWithValue>
>

export async function simulateNewOffer(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: SimulateNewOfferArgs,
) {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...newOfferParams(market, {
      ...args,
    }),
    address: actionParams.mgv,
  })
  return {
    request,
    offerId: result,
  }
}
