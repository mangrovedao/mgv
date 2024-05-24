import type {
  Client,
  TransactionReceipt,
  WaitForTransactionReceiptParameters,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import {
  type LimitOrderResult,
  type LimitOrderResultFromLogsParams,
  type RemoveOrderResult,
  type RemoveOrderResultFromLogsParams,
  type SetExpirationResultFromLogsParams,
  type UpdateOrderResult,
  type UpdateOrderResultFromLogsParams,
  limitOrderResultFromLogs,
  removeOrderResultFromLogs,
  setExpirationResultFromLogs,
  updateOrderResultFromLogs,
} from '../../lib/limit-order.js'
import type {
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/index.js'
import { getAction } from '../../utils/getAction.js'

export type WaitForLimitOrderResultParams =
  WaitForTransactionReceiptParameters &
    Omit<LimitOrderResultFromLogsParams, 'logs'>

export type ResultWithReceipt<T> = { receipt: TransactionReceipt; result: T }

export async function waitForLimitOrderResult(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: WaitForLimitOrderResultParams,
): Promise<ResultWithReceipt<LimitOrderResult>> {
  const receipt = await getAction(
    client,
    waitForTransactionReceipt,
    'waitForTransactionReceipt',
  )(params)
  const result = limitOrderResultFromLogs(actionParams, market, {
    ...params,
    logs: receipt.logs,
  })
  return { receipt, result }
}

export type WaitForLimitOrderUpdateResultParams =
  WaitForTransactionReceiptParameters &
    Omit<UpdateOrderResultFromLogsParams, 'logs'>

export async function waitForLimitOrderUpdateResult(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: WaitForLimitOrderUpdateResultParams,
): Promise<ResultWithReceipt<UpdateOrderResult>> {
  const receipt = await getAction(
    client,
    waitForTransactionReceipt,
    'waitForTransactionReceipt',
  )(params)
  const result = updateOrderResultFromLogs(actionParams, market, {
    ...params,
    logs: receipt.logs,
  })
  return { receipt, result }
}

export type WaitForSetExpirationResultParams =
  WaitForTransactionReceiptParameters &
    Omit<SetExpirationResultFromLogsParams, 'logs'>

export async function waitForSetExpirationResult(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: WaitForSetExpirationResultParams,
): Promise<ResultWithReceipt<bigint | undefined>> {
  const receipt = await getAction(
    client,
    waitForTransactionReceipt,
    'waitForTransactionReceipt',
  )(params)
  const result = setExpirationResultFromLogs(actionParams, market, {
    ...params,
    logs: receipt.logs,
  })
  return { receipt, result }
}

export type WaitForRemoveLimitOrderResult =
  WaitForTransactionReceiptParameters &
    Omit<RemoveOrderResultFromLogsParams, 'logs'>

export async function waitForRemoveLimitOrderResult(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: WaitForRemoveLimitOrderResult,
): Promise<ResultWithReceipt<RemoveOrderResult>> {
  const receipt = await getAction(
    client,
    waitForTransactionReceipt,
    'waitForTransactionReceipt',
  )(params)
  const result = removeOrderResultFromLogs(actionParams, market, {
    ...params,
    logs: receipt.logs,
  })
  return { receipt, result }
}
