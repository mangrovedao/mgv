import { describe, expect, inject, it } from 'vitest'
import { getBook } from '~mgv/actions/book.js'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '~test/src/markets.js'
import {
  humanPriceToRawPrice,
  rawPriceToHumanPrice,
} from '../human-readable.js'
import { priceFromTick, tickFromPrice } from '../tick.js'
import { getKandelPositionRawParams, validateKandelParams } from './params.js'

const { wethUSDC } = getMarkets()
const params = inject('mangrove')

const client = getClient()

describe('kandel params', () => {
  it('kandel position raw params', () => {
    const params = getKandelPositionRawParams({
      minPrice: 2500,
      midPrice: 3000,
      maxPrice: 3500,
      pricePoints: 10n,
      market: wethUSDC,
    })

    expect(params.pricePoints).toBe(10n)
    expect(params.firstAskIndex).toBe(5n)

    const baseQuoteTickIndex0 = tickFromPrice(
      humanPriceToRawPrice(2500, wethUSDC),
      wethUSDC.tickSpacing,
    )
    expect(params.baseQuoteTickIndex0).toBe(baseQuoteTickIndex0)
    expect(params.baseQuoteTickOffset % wethUSDC.tickSpacing).toBe(0n)

    const endTick =
      params.baseQuoteTickIndex0 +
      params.baseQuoteTickOffset * (params.pricePoints - 1n)
    const endPrice = rawPriceToHumanPrice(priceFromTick(endTick), wethUSDC)
    expect(endPrice).toApproximateEqual(3500)
  })

  it('validateKandelParams', async () => {
    const book = await getBook(client, params, wethUSDC)

    const _test = validateKandelParams({
      minPrice: 3100,
      midPrice: 3000,
      maxPrice: 3500,
      pricePoints: 10n,
      market: wethUSDC,
      baseAmount: 10n,
      quoteAmount: 10n,
      stepSize: 1n,
      gasreq: 250_000n,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
    })
  })
})
