import { type Client, type MulticallParameters } from 'viem'
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
  MangroveActionsDefaultParams &
  MarketParams &
  BookParams

/**
 *
 * @param client the viem client (public or wallet)
 * @param parameters the parameters for the initial call
 * @returns gets the book
 */
export async function getBook(
  client: Client,
  parameters: GetBookArgs,
): Promise<Book> {
  const {
    mgv,
    mgvReader,
    base,
    quote,
    tickSpacing,
    depth = 100n,
    ...multicallParams
  } = parameters

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

  return {
    asks: parseBookResult({
      result: rpcAsks,
      ba: BA.asks,
      baseDecimals: base.decimals,
      quoteDecimals: quote.decimals,
    }),
    bids: parseBookResult({
      result: rpcBids,
      ba: BA.bids,
      baseDecimals: base.decimals,
      quoteDecimals: quote.decimals,
    }),
    asksConfig: unpackLocalConfig(rpcAsksConfig),
    bidsConfig: unpackLocalConfig(rpcBaseConfig),
    marketConfig: unpackGlobalConfig(rpcMarketConfig),
  }
}
