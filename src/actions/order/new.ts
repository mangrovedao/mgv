import {
  type Address,
  type Client,
  type ReadContractParameters,
  type SimulateContractReturnType,
  type erc20Abi,
  maxUint128,
  maxUint256,
} from 'viem'
import { readContract, simulateContract } from 'viem/actions'
import {
  type LimitOrderParams,
  type RawLimitOrderParams,
  type limitOrderABI,
  limitOrderParams,
  rawLimitOrderParams,
} from '../../builder/order/new.js'
import { tokenAllowanceParams } from '../../builder/tokens.js'
import { BS } from '../../lib/enums.js'
import type {
  BuiltArgs,
  BuiltArgsWithValue,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import type { LimitOrderSteps } from '../../types/actions/steps.js'
import type { Prettify } from '../../types/lib.js'
import { getAction } from '../../utils/getAction.js'
import type { OverlyingResult } from '../balances.js'

export type GetLimitOrderStepsParams = {
  user: Address
  userRouter: Address
  bs: BS
  sendAmount?: bigint | undefined
  logic?: OverlyingResult | undefined
}

export type GetLimitOrderStepsArgs = Prettify<
  GetLimitOrderStepsParams &
    Omit<ReadContractParameters<typeof erc20Abi, 'allowance'>, BuiltArgs>
>

export async function getLimitOrderSteps(
  client: Client,
  market: MarketParams,
  args: GetLimitOrderStepsArgs,
): Promise<LimitOrderSteps> {
  const { sendAmount: amount = maxUint256 } = args
  const tokenToApprove =
    args.logic?.available && args.logic.overlying
      ? args.logic.overlying
      : args.bs === BS.buy
        ? market.quote
        : market.base

  const allowance = await getAction(
    client,
    readContract,
    'readContract',
  )({
    ...tokenAllowanceParams({
      owner: args.user,
      spender: args.userRouter,
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
        spender: args.userRouter,
      },
      done: allowance >= amount || allowance >= maxUint128,
    },
  ]
}

type LimitOrderSimulationParams = SimulationParams<typeof limitOrderABI, 'take'>

export type SimulateRawLimitOrderArgs = Prettify<
  RawLimitOrderParams & Omit<LimitOrderSimulationParams, BuiltArgsWithValue>
>

export async function simulateRawLimitOrder(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateRawLimitOrderArgs,
) {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as LimitOrderSimulationParams),
    ...rawLimitOrderParams(args),
    address: actionParams.mgv,
  })
}

export type SimulateLimitOrderArgs = Prettify<
  LimitOrderParams & Omit<LimitOrderSimulationParams, BuiltArgsWithValue>
>

export type SimulateLimitOrderResult = Prettify<
  SimulateContractReturnType<typeof limitOrderABI, 'take'>
>

export async function simulateLimitOrder(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  marketParams: MarketParams,
  args: SimulateLimitOrderArgs,
): Promise<SimulateLimitOrderResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as LimitOrderSimulationParams),
    ...limitOrderParams(marketParams, args),
    address: actionParams.mgvOrder,
  })
}
