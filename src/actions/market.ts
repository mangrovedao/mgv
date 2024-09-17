import type { Client } from 'viem'
import { readContract } from 'viem/actions'
import { buildToken } from '../addresses/index.js'
import {
  getMarketsABI,
  getMarketsBytecode,
} from '../addresses/logics/fetcher.js'
import type {
  GetMarketsParams,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../types/actions/index.js'
import { getAction } from '../utils/getAction.js'

/**
 *
 * @param client the viem client (public or wallet)
 * @param actionParams the parameters for the Mangrove actions
 * @param params the parameters for a given configs
 * @returns gets the Markets
 */

export async function getMarkets(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  params: GetMarketsParams,
): Promise<MarketParams[]> {
  const { mgvReader } = actionParams

  const markets = await getAction(
    client,
    readContract,
    'readContract',
  )({
    code: getMarketsBytecode,
    abi: getMarketsABI,
    functionName: 'getMarkets',
    args: [mgvReader],
  })

  return markets.map((market: any) => {
    const buildTokenWithParams = (tkn: any) =>
      buildToken({
        address: tkn.token,
        symbol: tkn.symbol,
        decimals: tkn.decimals,
        displayDecimals: params[tkn.symbol]?.displayDecimals,
        priceDisplayDecimals: params[tkn.symbol]?.priceDisplayDecimals,
      })

    const tkn0 = buildTokenWithParams(market.tkn0)
    const tkn1 = buildTokenWithParams(market.tkn1)
    const [base, quote] =
      params[market.tkn0.symbol] &&
      params[market.tkn1.symbol] &&
      params[market.tkn0.symbol]!.cashness >
        params[market.tkn1.symbol]!.cashness
        ? [tkn1, tkn0]
        : [tkn0, tkn1]

    return {
      base,
      quote,
      tickSpacing: BigInt(market.tickSpacing),
    }
  })
}
