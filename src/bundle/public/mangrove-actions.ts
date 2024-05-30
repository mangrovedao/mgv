import type { Address, Client } from 'viem'
import type { GetUserRouterArgs } from '../../actions/index.js'
import { getUserRouter } from '../../actions/index.js'
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
}

export function mangroveActions(actionsParams: MangroveActionsDefaultParams) {
  return (client: Client): MangroveActions => ({
    getUserRouter: (args) => getUserRouter(client, actionsParams, args),
    simulateDeployRouter: (args) =>
      simulateDeployRouter(client, actionsParams, args),
    getOrder: (args) => getOrder(client, actionsParams, args),
    getOrders: (args) => getOrders(client, actionsParams, args),
  })
}
