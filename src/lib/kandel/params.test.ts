import { describe, it, inject, expect } from 'vitest'
import { getKandelPositionRawParams } from './params.js'
import { priceFromTick, tickFromPrice } from '../tick.js'
import {
  humanPriceToRawPrice,
  rawPriceToHumanPrice,
} from '../human-readable.js'

const { wethUSDC } = inject('markets')

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
})
