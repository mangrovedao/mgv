import type { Client } from 'viem'
import {
  type GetBalanceResult,
  type GetBalancesArgs,
  getBalances,
} from '../../actions/balances.js'
import type { Logic } from '../../addresses/logics/utils.js'

export type GeneralActions = {
  /**
   *
   * @param args.markets the markets to get balances for
   * @param args.logics the logics to get balances for
   * @param args.user the user to get balances for
   * @returns balances of user for each token in markets, overlying tokens, and logic balances
   */
  getBalances: <TLogics extends Logic[] = Logic[]>(
    args: GetBalancesArgs<TLogics>,
  ) => Promise<GetBalanceResult<TLogics>>
}

export const generalActions = (client: Client): GeneralActions => ({
  getBalances: (args) => getBalances(client, args),
})
