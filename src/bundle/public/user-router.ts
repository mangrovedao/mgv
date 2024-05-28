import type { Address, Client } from 'viem'
import {
  type BindArgs,
  type BindResult,
  type IsBoundArgs,
  isBound,
  simulateBind,
} from '../../actions/smart-router.js'

export type UserRouterActions = {
  /** Checks if a given maker contract can use the user router */
  isBound: (args: IsBoundArgs) => Promise<boolean>

  /** Binds a given maker contract to the user router */
  simulateBind: (args: BindArgs) => Promise<BindResult>
}

export function userRouterActions(router: Address) {
  return (client: Client): UserRouterActions => ({
    isBound: (args) => isBound(client, router, args),
    simulateBind: (args) => simulateBind(client, router, args),
  })
}
