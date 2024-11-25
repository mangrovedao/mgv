import type { Address, Client } from 'viem'
import type {
  GetOpenMarketArgs,
  GetOpenMarketResult,
  GetUserRouterArgs,
} from '../../actions/index.js'
import { getOpenMarkets, getUserRouter } from '../../actions/index.js'
import {
  type GetOrdersArgs,
  type GetSingleOrderArgs,
  type OrderResult,
  getOrder,
  getOrders,
} from '../../actions/order/view.js'
import {
  type DeployRouterArgs,
  type DeployRouterResult,
  simulateDeployRouter,
} from '../../actions/smart-router.js'
import type { MangroveActionsDefaultParams } from '../../types/index.js'

export type MangroveActions = {
  /**
   *
   * @param args Get User Router Args
   * @returns the user router address
   * @example
   * const userRouter = await mangroveClient.getUserRouter({ user });
   * console.log(userRouter); // 0x...
   */
  getUserRouter: (args: GetUserRouterArgs) => Promise<Address>

  /** Deploys the smart router instance for the given user */
  simulateDeployRouter: (args: DeployRouterArgs) => Promise<DeployRouterResult>

  /** Get a single order details given its market, side, and id */
  getOrder: (args: GetSingleOrderArgs) => Promise<OrderResult>

  /** Gets multiple orders details given their markets, sides, and ids */
  getOrders: (args: GetOrdersArgs) => Promise<OrderResult[]>

  /**
   * Gets all open markets on Mangrove
   * @param args.cashnesses The cashness values for each token symbol (e.g. { "WETH": 10, "USDC": 100 }).
   *                       Tokens with higher cashness will be quote tokens, lower cashness will be base tokens.
   *                       For example, in the WETH/USDC market, WETH has higher cashness so it's the quote token.
   * @param args.displayDecimals The number of decimals to display for each token symbol
   * @param args.priceDisplayDecimals The number of decimals to display for prices in each token symbol
   * @param args.testTokens Array of token addresses that are test tokens
   * @returns Array of market parameters containing token pairs and tick spacing
   * @example
   * ```ts
   * const markets = await client.getOpenMarkets({
   *   cashnesses: {
   *     "WETH": 10,  // Lower cashness -> WETH will be base token
   *     "USDC": 100   // Higher cashness -> USDC will be quote token
   *   },
   *   displayDecimals: {
   *     "WETH": 4,
   *     "USDC": 2
   *   },
   *   priceDisplayDecimals: {
   *     "WETH": 2,
   *     "USDC": 4
   *   }
   * });
   * // Returns:
   * // [
   * //   {
   * //     base: { address: "0x...", symbol: "WETH", decimals: 18, ... },
   * //     quote: { address: "0x...", symbol: "USDC", decimals: 6, ... },
   * //     tickSpacing: 1n
   * //   },
   * //   ...
   * // ]
   * ```
   */
  getOpenMarkets: (args: GetOpenMarketArgs) => Promise<GetOpenMarketResult>
}

export function mangroveActions(actionsParams: MangroveActionsDefaultParams) {
  return (client: Client): MangroveActions => ({
    getUserRouter: (args) => getUserRouter(client, actionsParams, args),
    simulateDeployRouter: (args) =>
      simulateDeployRouter(client, actionsParams, args),
    getOrder: (args) => getOrder(client, actionsParams, args),
    getOrders: (args) => getOrders(client, actionsParams, args),
    getOpenMarkets: (args) => getOpenMarkets(client, actionsParams, args),
  })
}
