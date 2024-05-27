import {
  type Address,
  type Client,
  type ReadContractParameters,
  type WaitForTransactionReceiptParameters,
  type erc20Abi,
  maxUint128,
  maxUint256,
} from 'viem'
import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
} from 'viem/actions'
import type {
  MarketOrderByTickParams,
  MarketOrderByVolumeAndMarketParams,
  MarketOrderByVolumeParams,
  marketOrderByTickABI,
} from '../builder/market-order.js'
import {
  marketOrderByTickParams,
  marketOrderByVolumeAndMarketParams,
  marketOrderByVolumeParams,
} from '../builder/market-order.js'
import { tokenAllowanceParams } from '../builder/tokens.js'
import { BS } from '../lib/enums.js'
import {
  type MarketOrderResultFromLogsParams,
  marketOrderResultFromLogs,
} from '../lib/market-order.js'
import type {
  BuiltArgs,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../types/actions/index.js'
import type { MarketOrderResult } from '../types/actions/market-order.js'
import type { SimulationParams } from '../types/actions/simulation.js'
import type { MarketOrderSteps } from '../types/actions/steps.js'
import type { Prettify } from '../types/lib.js'
import { getAction } from '../utils/getAction.js'
import type { ResultWithReceipt } from './order/results.js'

export type GetMarketOrderStepsParams = {
  user: Address
  bs: BS
  sendAmount?: bigint | undefined
}

export type GetMarketOrderStepsArgs = Prettify<
  GetMarketOrderStepsParams &
    Omit<ReadContractParameters<typeof erc20Abi, 'allowance'>, BuiltArgs>
>

export async function getMarketOrderSteps(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: GetMarketOrderStepsArgs,
): Promise<MarketOrderSteps> {
  const { sendAmount: amount = maxUint256 } = args
  const tokenToApprove = args.bs === BS.buy ? market.quote : market.base

  const allowance = await getAction(
    client,
    readContract,
    'readContract',
  )({
    ...args,
    ...tokenAllowanceParams({
      owner: args.user,
      spender: actionParams.mgv,
      token: tokenToApprove.address,
    }),
  })

  return [
    {
      type: 'erc20Approval',
      params: {
        token: tokenToApprove,
        from: args.user,
        spender: actionParams.mgv,
        amount,
      },
      done: allowance >= amount || allowance >= maxUint128,
    },
  ]
}

type MarketOrderSimulationParams = SimulationParams<
  typeof marketOrderByTickABI,
  'marketOrderByTick'
>

export type SimulateMarketOrderByTickArgs = Prettify<
  MarketOrderByTickParams & Omit<MarketOrderSimulationParams, BuiltArgs>
>

export async function simulateMarketOrderByTick(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateMarketOrderByTickArgs,
): Promise<MarketOrderResult> {
  const {
    result: [takerGot, takerGave, bounty, feePaid],
    request,
  } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as MarketOrderSimulationParams),
    ...marketOrderByTickParams(args),
    address: actionParams.mgv,
  })
  return {
    takerGot,
    takerGave,
    bounty,
    feePaid,
    request,
  }
}

export type SimulateMarketOrderByVolumeArgs = Prettify<
  MarketOrderByVolumeParams & Omit<MarketOrderSimulationParams, BuiltArgs>
>

export async function simulateMarketOrderByVolume(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateMarketOrderByVolumeArgs,
): Promise<MarketOrderResult> {
  const {
    result: [takerGot, takerGave, bounty, feePaid],
    request,
  } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as MarketOrderSimulationParams),
    ...marketOrderByVolumeParams(args),
    address: actionParams.mgv,
  })
  return {
    takerGot,
    takerGave,
    bounty,
    feePaid,
    request,
  }
}

export type SimulateMarketOrderByVolumeAndMarketArgs = Prettify<
  MarketOrderByVolumeAndMarketParams &
    Omit<MarketOrderSimulationParams, BuiltArgs>
>

export async function simulateMarketOrderByVolumeAndMarket(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  marketParams: MarketParams,
  args: SimulateMarketOrderByVolumeAndMarketArgs,
): Promise<MarketOrderResult> {
  const {
    result: [takerGot, takerGave, bounty, feePaid],
    request,
  } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as MarketOrderSimulationParams),
    ...marketOrderByVolumeAndMarketParams(marketParams, args),
    address: actionParams.mgv,
  })
  return {
    takerGot,
    takerGave,
    bounty,
    feePaid,
    request,
  }
}

export type WaitForMarketOrderResultParams =
  WaitForTransactionReceiptParameters &
    Omit<MarketOrderResultFromLogsParams, 'logs'>

export async function waitForMarketOrderResult(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: WaitForMarketOrderResultParams,
): Promise<ResultWithReceipt<Omit<MarketOrderResult, 'request'>>> {
  const receipt = await getAction(
    client,
    waitForTransactionReceipt,
    'waitForTransactionReceipt',
  )(params)
  const result = marketOrderResultFromLogs(actionParams, market, {
    ...params,
    logs: receipt.logs,
  })
  return { result, receipt }
}
