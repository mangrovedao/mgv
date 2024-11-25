import type { Address, Client } from 'viem'
import {
  type GetBalanceResult,
  type GetBalancesArgs,
  getBalances,
} from '../../actions/balances.js'
import {
  type GetTokensParams,
  type GetTokensResult,
  getTokens,
} from '../../actions/tokens.js'
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

  /**
   *
   * @param args.tokens the tokens to get info for
   * @param args.displayDecimals the decimals to display for each token
   * @param args.priceDisplayDecimals the decimals to display for each token's price
   * @param args.testTokens the tokens that are mangrove test tokens
   * @returns all tokens and their info
   * @example
   * ```ts
   * const tokens = await client.getTokens({
   *   tokens: [WETHaddress, USDCaddress],
   *   displayDecimals: { WETH: 4, USDC: 2 }, // optional
   *   priceDisplayDecimals: { WETH: 2, USDC: 4 }, // optional
   *   testTokens: [WETH.address] // optional
   * })
   * // Returns:
   * // {
   * //   WETH: { address: "0x...", symbol: "WETH", decimals: 18, displayDecimals: 4, priceDisplayDecimals: 2, isTestToken: true },
   * //   USDC: { address: "0x...", symbol: "USDC", decimals: 6, displayDecimals: 2, priceDisplayDecimals: 4, isTestToken: false }
   * // }
   * ```
   */
  getTokens: <T extends readonly Address[] = readonly Address[]>(
    args: GetTokensParams<T>,
  ) => Promise<GetTokensResult<T>>
}

export const generalActions = (client: Client): GeneralActions => ({
  getBalances: (args) => getBalances(client, args),
  getTokens: (args) => getTokens(client, args),
})
