import type { Client } from 'viem'
import { type GetBookArgs, getBook } from '../../actions/book.js'
import {
  type GetLimitOrderStepsArgs,
  getLimitOrderSteps,
} from '../../actions/limit-order.js'
import {
  type GetMarketOrderStepsArgs,
  type SimulateMarketOrderByVolumeAndMarketArgs,
  getMarketOrderSteps,
  simulateMarketOrderByVolumeAndMarket,
} from '../../actions/market-order.js'
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
  })
}
