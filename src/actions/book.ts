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
  parameters?: GetBookArgs | undefined,
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

  const minAsk = asks[0]?.price
  const maxBid = bids[0]?.price

  let midPrice = 0
  let spread = 0
  let spreadPercent = 0

  if (minAsk && maxBid) {
    midPrice = (minAsk + maxBid) / 2
    spread = Math.abs(minAsk - maxBid)
    spreadPercent = spread / midPrice
  } else if (minAsk) {
    midPrice = minAsk
  } else if (maxBid) {
    midPrice = maxBid
  }

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
