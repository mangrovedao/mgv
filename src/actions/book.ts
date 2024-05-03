import type { Client, MulticallParameters } from 'viem'
import { multicall } from 'viem/actions'
import { getBookParams, parseBookResult } from '../builder/book.js'
import {
  getGlobalConfigParams,
  getLocalConfigParams,
} from '../builder/config.js'
import { BA } from '../lib/enums.js'
import { unpackGlobalConfig } from '../lib/global.js'
import { unpackLocalConfig } from '../lib/local.js'
import { getSemibooksOLKeys } from '../lib/ol-key.js'
import type { Book, BookParams } from '../types/actions/book.js'
import type { MangroveActionsDefaultParams } from '../types/actions/index.js'
import type { MarketParams } from '../types/actions/index.js'
import { getAction } from '../utils/getAction.js'

export type GetBookArgs = Omit<
  MulticallParameters,
  'contracts' | 'allowFailure'
> &
  BookParams

/**
 *
 * @param client the viem client (public or wallet)
 * @param actionParams the parameters for the Mangrove actions
 * @param marketParams the parameters for the market
 * @param parameters the parameters for the initial call
 * @returns gets the book
 */
export async function getBook(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  marketParams: MarketParams,
  parameters?: GetBookArgs,
): Promise<Book> {
  const { depth = 100n, ...multicallParams } = parameters || {}
  const { mgv, mgvReader } = actionParams
  const { base, quote, tickSpacing } = marketParams

  const { asksMarket, bidsMarket } = getSemibooksOLKeys({
    base: base.address,
    quote: quote.address,
    tickSpacing,
  })

  const [rpcAsks, rpcBids, rpcAsksConfig, rpcBaseConfig, rpcMarketConfig] =
    await getAction(
      client,
      multicall,
      'multicall',
    )({
      ...multicallParams,
      contracts: [
        {
          address: mgvReader,
          ...getBookParams({
            olKey: asksMarket,
            maxOffers: depth,
          }),
        },
        {
          address: mgvReader,
          ...getBookParams({
            olKey: bidsMarket,
            maxOffers: depth,
          }),
        },
        {
          address: mgv,
          ...getLocalConfigParams({
            olKey: asksMarket,
          }),
        },
        {
          address: mgv,
          ...getLocalConfigParams({
            olKey: bidsMarket,
          }),
        },
        {
          address: mgv,
          ...getGlobalConfigParams(),
        },
      ],
      allowFailure: false,
    })

  const asks = parseBookResult({
    result: rpcAsks,
    ba: BA.asks,
    baseDecimals: base.decimals,
    quoteDecimals: quote.decimals,
  })

  const bids = parseBookResult({
    result: rpcBids,
    ba: BA.bids,
    baseDecimals: base.decimals,
    quoteDecimals: quote.decimals,
  })

  const midPrice = !asks[0]?.price
    ? !bids[0]?.price
      ? 0
      : bids[0].price
    : (asks[0].price + bids[0].price) / 2

  const spread =
    !asks[0]?.price || !bids[0]?.price ? 0 : asks[0].price - bids[0].price

  const spreadPercent =
    !asks[0]?.price || !bids[0]?.price ? 0 : spread / midPrice

  return {
    asks,
    bids,
    asksConfig: unpackLocalConfig(rpcAsksConfig),
    bidsConfig: unpackLocalConfig(rpcBaseConfig),
    marketConfig: unpackGlobalConfig(rpcMarketConfig),
    midPrice,
    spread,
    spreadPercent,
  }
}
