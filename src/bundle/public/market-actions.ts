import type { Client } from 'viem'
import { type GetBookArgs, getBook } from '../../actions/book.js'
import {
  type GetMarketOrderStepsArgs,
  type SimulateMarketOrderByVolumeAndMarketArgs,
  getMarketOrderSteps,
  simulateMarketOrderByVolumeAndMarket,
} from '../../actions/market-order.js'
import {
  type GetLimitOrderStepsArgs,
  type SimulateLimitOrderArgs,
  type SimulateLimitOrderResult,
  getLimitOrderSteps,
  simulateLimitOrder,
} from '../../actions/order/new.js'
import {
  type RetractOrderResult,
  type SimulateRemoveOrderArgs,
  simulateRemoveOrder,
} from '../../actions/order/remove.js'
import {
  type SimulateUpdateOrderArgs,
  type SimulateUpdateOrderResult,
  simulateUpdateOrder,
} from '../../actions/order/update.js'
import type { Book } from '../../types/actions/book.js'
import type {
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { MarketOrderResult } from '../../types/actions/market-order.js'
import type {
  LimitOrderSteps,
  MarketOrderSteps,
} from '../../types/actions/steps.js'

export type PublicMarketActions = {
  /**
   *
   * @param args args for the get book call
   * @returns the book object
   * @example
   *
   * ```ts
   * const book = await publicMarketActions.getBook();
   * ```
   */
  getBook: (args: GetBookArgs) => Promise<Book>

  /**
   * Get the steps for a market order
   * @param args args for the get market order steps call
   * @returns the market order steps
   * @example
   *
   * ```ts
   * const steps = await publicMarketActions.getMarketOrderSteps({
   *   user: userAddress,
   *   bs: BS.buy,
   *   sendAmount: parseEther('1'),
   * });
   *
   * console.log(steps); // [{type: 'approval', params: {token: ...}, done: false}]
   * ```
   */
  getMarketOrderSteps: (
    args: GetMarketOrderStepsArgs,
  ) => Promise<MarketOrderSteps>

  /**
   * Get the steps for a limit order
   * @param args args for the get limit order steps call
   * @returns the limit order steps
   * @example
   *
   * ```ts
   * const steps = await publicMarketActions.getLimitOrderSteps({
   *   user: userAddress,
   *   userRouter: routerAddress,
   *   bs: BS.buy,
   *   sendAmount: parseEther('1'),
   * });
   *
   * console.log(steps); // [{type: 'approval', params: {token: ...}, done: false}]
   * ```
   */
  getLimitOrderSteps: (args: GetLimitOrderStepsArgs) => Promise<LimitOrderSteps>

  /**
   *
   * @param args args for the simulate market order by volume and market call
   * @returns the market order result
   * @example
   *
   * ```ts
   * // Buying 1 WETH for 3000 DAI
   * const { request, ...result } = await publicMarketActions.simulateMarketOrderByVolumeAndMarket({
   *   baseAmount: parseEther('1'), // 1 WETH
   *   quoteAmount: parseEther('3000'), // 3000 DAI
   *   bs: BS.buy,
   *   slippage: 0.5 / 100, // 0.5% slippage
   * });
   * // sending the transaction
   * const tx = await walletClient.writeContract(request);
   * ```
   */
  simulateMarketOrderByVolumeAndMarket: (
    args: SimulateMarketOrderByVolumeAndMarketArgs,
  ) => Promise<MarketOrderResult>

  /**
   *
   * @param args args for the simulate limit order call
   * @returns the limit order result
   * @example
   *
   * ```ts
   * // Buying 1 WETH for 3000 DAI
   * const { request, result } = await publicMarketActions.simulateLimitOrder({
   *   baseAmount: parseEther('1'), // 1 WETH
   *   quoteAmount: parseEther('3000'), // 3000 DAI
   *   bs: BS.buy,
   *   book,
   * });
   * // sending the transaction
   * const tx = await walletClient.writeContract(request);
   * ```
   */
  simulateLimitOrder: (
    args: SimulateLimitOrderArgs,
  ) => Promise<SimulateLimitOrderResult>

  simulateUpdateOrder: (
    args: SimulateUpdateOrderArgs,
  ) => Promise<SimulateUpdateOrderResult>

  simulateRemoveOrder: (
    args: SimulateRemoveOrderArgs,
  ) => Promise<RetractOrderResult>
}

export function publicMarketActions(
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
) {
  return (client: Client): PublicMarketActions => ({
    getBook: (args) => getBook(client, actionParams, market, args),
    getMarketOrderSteps: (args) =>
      getMarketOrderSteps(client, actionParams, market, args),
    getLimitOrderSteps: (args) => getLimitOrderSteps(client, market, args),
    simulateMarketOrderByVolumeAndMarket: (args) =>
      simulateMarketOrderByVolumeAndMarket(client, actionParams, market, args),
    simulateLimitOrder: (args) =>
      simulateLimitOrder(client, actionParams, market, args),
    simulateUpdateOrder: (args) =>
      simulateUpdateOrder(client, actionParams, market, args),
    simulateRemoveOrder: (args) =>
      simulateRemoveOrder(client, actionParams, market, args),
  })
}
