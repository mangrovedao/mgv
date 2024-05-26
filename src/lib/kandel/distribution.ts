import type { MarketParams } from '../../index.js'
import { BA } from '../enums.js'
import { rawPriceToHumanPrice } from '../human-readable.js'
import { outboundFromInbound, priceFromTick } from '../tick.js'

export type CreateGeometricDistributionParams = {
  baseQuoteTickIndex0: bigint
  baseQuoteTickOffset: bigint
  firstAskIndex: bigint
  pricePoints: bigint
  stepSize: bigint
  market: MarketParams
  from?: bigint | undefined
  to?: bigint | undefined
} & (
  | {
      bidGives: bigint
      askGives?: undefined
    }
  | {
      bidGives?: undefined
      askGives: bigint
    }
  | {
      bidGives: bigint
      askGives: bigint
    }
)

export type DistributionOffer = {
  index: bigint
  tick: bigint
  gives: bigint
  price: number
}

export type Distribution = {
  asks: DistributionOffer[]
  bids: DistributionOffer[]
}

export class CreateDistributionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CreateDistributionError'
  }
}

function transportDestination(
  ba: BA,
  index: bigint,
  step: bigint,
  pricePoints: bigint,
) {
  let better = 0n
  if (ba === BA.asks) {
    better = index + step
    if (better >= pricePoints) better = pricePoints - 1n
  } else {
    if (index >= step) {
      better = index - step
    }
  }
  return better
}

function getBounds(params: CreateGeometricDistributionParams) {
  let {
    pricePoints,
    from = 0n,
    to = pricePoints,
    stepSize,
    firstAskIndex,
  } = params

  // determine global bidBound
  const bidHoleSize = stepSize / 2n + (stepSize % 2n)
  let bidBound = firstAskIndex > bidHoleSize ? firstAskIndex - bidHoleSize : 0n
  const lastBidWithDualAsk = pricePoints - stepSize
  if (bidBound > lastBidWithDualAsk) bidBound = lastBidWithDualAsk

  firstAskIndex = firstAskIndex + stepSize / 2n
  if (firstAskIndex < stepSize) firstAskIndex = stepSize

  if (to < bidBound) bidBound = to
  if (from > firstAskIndex) firstAskIndex = from

  const count =
    (from < bidBound ? bidBound - from : 0n) +
    (to > firstAskIndex ? to - firstAskIndex : 0n)

  return { bidBound, firstAskIndex, from, to, count }
}

export function createGeometricDistribution(
  params: CreateGeometricDistributionParams,
): Distribution {
  const {
    baseQuoteTickIndex0,
    baseQuoteTickOffset,
    bidGives,
    askGives,
    stepSize,
    pricePoints,
    market,
  } = params

  if (!bidGives && !askGives) {
    throw new CreateDistributionError(
      'Either bidGives or askGives must be provided',
    )
  }

  const { bidBound, firstAskIndex, from, to } = getBounds(params)
  const asks: DistributionOffer[] = []
  const bids: DistributionOffer[] = []

  let index = from
  let tick = -(baseQuoteTickIndex0 + baseQuoteTickOffset * index)

  for (; index < bidBound; ++index) {
    const price = market
      ? rawPriceToHumanPrice(priceFromTick(-tick), market)
      : priceFromTick(-tick)
    bids.push({
      index,
      tick,
      gives: !bidGives ? outboundFromInbound(tick, askGives!) : bidGives,
      price,
    })

    const dualIndex = transportDestination(
      BA.asks,
      index,
      stepSize,
      pricePoints,
    )

    asks.push({
      index: dualIndex,
      tick: baseQuoteTickIndex0 + baseQuoteTickOffset * dualIndex,
      gives: 0n,
      price,
    })

    tick -= baseQuoteTickOffset
  }

  index = firstAskIndex
  tick = baseQuoteTickIndex0 + baseQuoteTickOffset * index

  for (; index < to; ++index) {
    const price = market
      ? rawPriceToHumanPrice(priceFromTick(tick), market)
      : priceFromTick(tick)
    asks.push({
      index,
      tick,
      gives: !askGives ? outboundFromInbound(tick, bidGives!) : askGives,
      price,
    })

    const dualIndex = transportDestination(
      BA.bids,
      index,
      stepSize,
      pricePoints,
    )

    bids.push({
      index: dualIndex,
      tick: -(baseQuoteTickIndex0 + baseQuoteTickOffset * dualIndex),
      gives: 0n,
      price,
    })

    tick += baseQuoteTickOffset
  }

  return { asks, bids }
}
