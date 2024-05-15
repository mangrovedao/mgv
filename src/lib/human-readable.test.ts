import { describe, it, inject, expect } from 'vitest'
import {
  amounts,
  amountsToHumanPrice,
  humanPriceToRawPrice,
  rawPriceToHumanPrice,
  rpcOfferToHumanOffer,
} from './human-readable.js'
import { parseUnits } from 'viem'
import { tickFromVolumes } from './tick.js'
import { BA } from './enums.js'

const { wethUSDC } = inject('markets')
const { USDC, WETH } = inject('tokens')

// price is quote/base
// USDC is 6 decimals
// DAI and WETH are 18 decimals

describe('human readable', () => {
  it('rawPriceToHumanPrice', () => {
    const humanPrice = 3000
    const rawPrice = (3000 * 1e6) / 1e18
    const price = rawPriceToHumanPrice(rawPrice, wethUSDC)
    expect(price).toBe(humanPrice)
  })

  it('humanPriceToRawPrice', () => {
    const humanPrice = 3000
    const rawPrice = (3000 * 1e6) / 1e18
    const price = humanPriceToRawPrice(humanPrice, wethUSDC)
    expect(price).toBe(rawPrice)
  })

  it('amountsToHumanPrice', () => {
    const amountUSDC = parseUnits('3000', USDC.decimals)
    const amountWETH = parseUnits('1', WETH.decimals)
    const price = amountsToHumanPrice(
      { baseAmount: amountWETH, quoteAmount: amountUSDC },
      wethUSDC,
    )
    expect(price).toBe(3000)
  })

  it('amounts', () => {
    const humanPrice = 3000
    const baseAmount = parseUnits('1', WETH.decimals)
    const quoteAmount = parseUnits('3000', USDC.decimals)

    expect(
      amounts({ baseAmount, quoteAmount }, wethUSDC),
      'Wrong human price',
    ).toEqual(expect.objectContaining({ baseAmount, quoteAmount, humanPrice }))

    expect(
      amounts({ humanPrice, baseAmount }, wethUSDC).quoteAmount,
      'Wrong quote amount',
    ).toApproximateEqual(quoteAmount, 0.0001)

    expect(
      amounts({ humanPrice, quoteAmount }, wethUSDC).baseAmount,
      'Wrong base amount',
    ).toApproximateEqual(baseAmount, 0.0001)
  })

  it('rpcOfferToHumanOffer', () => {
    const baseAmount = parseUnits('1', WETH.decimals)
    const quoteAmount = parseUnits('3000', USDC.decimals)
    const tickBid = tickFromVolumes(
      baseAmount,
      quoteAmount,
      wethUSDC.tickSpacing,
    )
    const tickAsk = tickFromVolumes(
      quoteAmount,
      baseAmount,
      wethUSDC.tickSpacing,
    )
    const humanPrice = 3000
    const offerBid = rpcOfferToHumanOffer({
      gives: quoteAmount,
      tick: tickBid,
      ba: BA.bids,
      baseDecimals: WETH.decimals,
      quoteDecimals: USDC.decimals,
    })

    expect(offerBid.price).toApproximateEqual(humanPrice, 0.0001)
    expect(offerBid.total).toApproximateEqual(3000, 0.0001)
    expect(offerBid.volume).toApproximateEqual(1, 0.0001)
    expect(offerBid.ba).toBe(BA.bids)

    const offerAsk = rpcOfferToHumanOffer({
      gives: baseAmount,
      tick: tickAsk,
      ba: BA.asks,
      baseDecimals: WETH.decimals,
      quoteDecimals: USDC.decimals,
    })

    expect(offerAsk.price).toApproximateEqual(humanPrice, 0.0001)
    expect(offerAsk.total).toApproximateEqual(3000, 0.0001)
    expect(offerAsk.volume).toApproximateEqual(1, 0.0001)
    expect(offerAsk.ba).toBe(BA.asks)
  })
})
