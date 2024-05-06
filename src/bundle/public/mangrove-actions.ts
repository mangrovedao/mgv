import type { Address, Client } from 'viem'
import type { GetUserRouterArgs } from '../../actions/index.js'
import { getUserRouter } from '../../actions/index.js'
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
}

export function mangroveActions(actionsParams: MangroveActionsDefaultParams) {
  return (client: Client): MangroveActions => ({
    getUserRouter: (args) => getUserRouter(client, actionsParams, args),
  })
}
