import { type LocalConfig, type MarketParams, minVolume } from '../../index.js'
import {
  humanPriceToRawPrice,
  rawPriceToHumanPrice,
} from '../human-readable.js'
import { priceFromTick, tickFromPrice } from '../tick.js'
import {
  type Distribution,
  createGeometricDistribution,
} from './distribution.js'

export type RawKandelPositionParams = {
  minPrice: number
  maxPrice: number
  midPrice: number
  pricePoints: bigint
  market: MarketParams
}

export type PositionKandelParams = {
  baseQuoteTickIndex0: bigint
  baseQuoteTickOffset: bigint
  firstAskIndex: bigint
}

function getKandelPositionRawParams(
  params: RawKandelPositionParams,
): PositionKandelParams {
  const { market, pricePoints } = params
  const baseQuoteTickIndex0 = tickFromPrice(
    humanPriceToRawPrice(params.minPrice, market),
    market.tickSpacing,
  )
  const midTick = tickFromPrice(
    humanPriceToRawPrice(params.midPrice, market),
    market.tickSpacing,
  )
  const maxTick = tickFromPrice(
    humanPriceToRawPrice(params.maxPrice, market),
    market.tickSpacing,
  )
  let baseQuoteTickOffset =
    ((maxTick - baseQuoteTickIndex0) /
      (pricePoints - 1n) /
      market.tickSpacing) *
    market.tickSpacing
  if (baseQuoteTickOffset === 0n) baseQuoteTickOffset = market.tickSpacing
  let firstAskIndex = 0n

  for (; firstAskIndex < pricePoints; ++firstAskIndex) {
    if (baseQuoteTickIndex0 + firstAskIndex * baseQuoteTickOffset >= midTick)
      break
  }

  return {
    baseQuoteTickIndex0,
    baseQuoteTickOffset,
    firstAskIndex,
  }
}

export type RawKandelParams = RawKandelPositionParams & {
  baseAmount: bigint
  quoteAmount: bigint
  stepSize: bigint
  gasreq: bigint
  factor: number
  asksLocalConfig: LocalConfig
  bidsLocalConfig: LocalConfig
}

export type KandelParams = PositionKandelParams & {
  stepSize: bigint
  askGives: bigint
  bidGives: bigint
  gasreq: bigint
}

export type ValidateParamsResult = {
  params: KandelParams
  rawParams: RawKandelParams
  minBaseAmount: bigint
  minQuoteAmount: bigint
  minProvision: bigint
}

function countBidsAndAsks(distribution: Distribution) {
  let nBids = 0n
  let nAsks = 0n
  for (let i = 0; i < distribution.asks.length; i++) {
    if (distribution.asks[i].gives !== 0n) nAsks++
    if (distribution.bids[i].gives !== 0n) nBids++
  }
  return {
    nBids,
    nAsks,
  }
}

function changeGives(
  distribution: Distribution,
  bidGives: bigint,
  askGives: bigint,
): Distribution {
  for (let i = 0; i < distribution.asks.length; i++) {
    if (distribution.asks[i].gives !== 0n) distribution.asks[i].gives = askGives
    if (distribution.bids[i].gives !== 0n) distribution.bids[i].gives = bidGives
  }
  return distribution
}

export function validateKandelParams(
  params: RawKandelParams,
): ValidateParamsResult {
  const { baseQuoteTickIndex0, baseQuoteTickOffset, firstAskIndex } =
    getKandelPositionRawParams(params)

  const {
    pricePoints,
    stepSize,
    market,
    gasreq: _gasreq,
    factor,
    asksLocalConfig,
    bidsLocalConfig,
  } = params

  let distribution = createGeometricDistribution({
    baseQuoteTickIndex0,
    baseQuoteTickOffset,
    firstAskIndex,
    pricePoints,
    stepSize,
    askGives: 1n,
    bidGives: 1n,
  })

  const { nBids, nAsks } = countBidsAndAsks(distribution)
  // asks gives base and bids gives quote
  const askGives = params.baseAmount / nAsks
  const bidGives = params.quoteAmount / nBids

  distribution = changeGives(distribution, bidGives, askGives)

  const baseAmount = askGives * nAsks
  const quoteAmount = bidGives * nBids

  const minPrice = rawPriceToHumanPrice(
    priceFromTick(baseQuoteTickIndex0),
    market,
  )
  const maxPrice = rawPriceToHumanPrice(
    priceFromTick(
      baseQuoteTickIndex0 + baseQuoteTickOffset * (pricePoints - 1n),
    ),
    market,
  )

  const gasreq = BigInt(Number(_gasreq) * factor)
  const minBaseAmount = minVolume(asksLocalConfig, gasreq) * nAsks
  const minQuoteAmount = minVolume(bidsLocalConfig, gasreq) * nBids
  const minProvision =
    (gasreq + asksLocalConfig.offer_gasbase) * nAsks +
    (gasreq + bidsLocalConfig.offer_gasbase) * nBids

  return {
    params: {
      baseQuoteTickIndex0,
      baseQuoteTickOffset,
      firstAskIndex,
      stepSize,
      askGives,
      bidGives,
      gasreq,
    },
    rawParams: {
      ...params,
      baseAmount,
      quoteAmount,
      minPrice,
      maxPrice,
    },
    minBaseAmount,
    minQuoteAmount,
    minProvision,
  }
}