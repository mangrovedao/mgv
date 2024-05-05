import { formatUnits } from 'viem'
import type { MarketParams } from '../types/index.js'
import type { BA } from './enums.js'
import {
  inboundFromOutbound,
  outboundFromInbound,
  tickFromPrice,
  tickFromVolumes,
} from './tick.js'

// if ask, then outbound is the base, inbound is the quote
// if bid, then outbound is the quote, inbound is the base

export function rpcOfferToHumanOffer({
  ba,
  gives,
  tick,
  baseDecimals,
  quoteDecimals,
}: {
  gives: bigint
  tick: bigint
  ba: BA
  baseDecimals: number
  quoteDecimals: number
}) {
  if (ba === 'asks') {
    const volume = Number(formatUnits(gives, baseDecimals))
    const total = Number(
      formatUnits(inboundFromOutbound(tick, gives), quoteDecimals),
    )
    const price = total / volume
    return {
      volume,
      total,
      price,
      ba,
    }
  }
  const total = Number(formatUnits(gives, quoteDecimals))
  const volume = Number(
    formatUnits(inboundFromOutbound(tick, gives), baseDecimals),
  )
  const price = total / volume
  return {
    volume,
    total,
    price,
    ba,
  }
}

export function rawPriceToHumanPrice(
  price: number,
  market: MarketParams,
): number {
  // if market is WETH/USDC, and 1 WETH = 3000 USDC, WETH decimals = 18, USDC decimals = 6
  // this means raw price is (3000 * 1e6) / (1 * 1e18) = 3000 * 1e(-12)
  // So if we want to convert this to human readable price, we need to multiply by 1e12 = 1e(18 - 6) = 1e(baseDecimals - quoteDecimals)
  return price * 10 ** (market.base.decimals - market.quote.decimals)
}

export function humanPriceToRawPrice(
  price: number,
  market: MarketParams,
): number {
  return price * 10 ** (market.quote.decimals - market.base.decimals)
}

export type AmountsToHumanPriceParams = {
  baseAmount: bigint
  quoteAmount: bigint
}

export function amountsToHumanPrice(
  params: AmountsToHumanPriceParams,
  market: MarketParams,
): number {
  const price = Number(params.quoteAmount) / Number(params.baseAmount)
  return rawPriceToHumanPrice(price, market)
}

export type AmountsParams =
  | {
      baseAmount: bigint
      quoteAmount: bigint
    }
  | {
      humanPrice: number
      baseAmount: bigint
    }
  | {
      humanPrice: number
      quoteAmount: bigint
    }

export type AmountsOutput = {
  baseAmount: bigint
  quoteAmount: bigint
  humanPrice: number
}

export function amounts(
  params: AmountsParams,
  market: MarketParams,
): AmountsOutput {
  // quote is inbound, base is outbound
  const tick =
    'humanPrice' in params
      ? tickFromPrice(
          humanPriceToRawPrice(params.humanPrice, market),
          market.tickSpacing,
        )
      : tickFromVolumes(
          params.quoteAmount,
          params.baseAmount,
          market.tickSpacing,
        )
  const baseAmount =
    'baseAmount' in params
      ? params.baseAmount
      : outboundFromInbound(tick, params.quoteAmount)
  const quoteAmount =
    'quoteAmount' in params
      ? params.quoteAmount
      : inboundFromOutbound(tick, params.baseAmount)
  const humanPrice = amountsToHumanPrice({ baseAmount, quoteAmount }, market)
  return { baseAmount, quoteAmount, humanPrice }
}
