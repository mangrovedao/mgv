import {
  type GlobalConfig,
  type LocalConfig,
  type Logic,
  type MarketParams,
  minVolume,
} from '../../index.js'
import {
  humanPriceToRawPrice,
  rawPriceToHumanPrice,
} from '../human-readable.js'
import { getDefaultLimitOrderGasreq } from '../limit-order.js'
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
  adjust?: boolean | undefined
}

export type PositionKandelParams = {
  baseQuoteTickIndex0: bigint
  baseQuoteTickOffset: bigint
  firstAskIndex: bigint
  pricePoints: bigint
}

function getTick(price: number, tickSpacing: bigint, adjust: boolean) {
  const lowerTick = tickFromPrice(price, tickSpacing, false)
  if (!adjust) return lowerTick
  const upperTick = tickFromPrice(price, tickSpacing, true)

  if (upperTick === lowerTick) return lowerTick

  const lowerPrice = priceFromTick(lowerTick)
  const upperPrice = priceFromTick(upperTick)

  const lowerDiff = Math.abs(price - lowerPrice)
  const upperDiff = Math.abs(price - upperPrice)

  return lowerDiff < upperDiff ? lowerTick : upperTick
}

export function getKandelPositionRawParams(
  params: RawKandelPositionParams,
): PositionKandelParams {
  const { market, pricePoints } = params
  const minPriceRaw = humanPriceToRawPrice(params.minPrice, market)
  const midPriceRaw = humanPriceToRawPrice(params.midPrice, market)
  const maxPriceRaw = humanPriceToRawPrice(params.maxPrice, market)

  const baseQuoteTickIndex0 = getTick(
    minPriceRaw,
    market.tickSpacing,
    params.adjust ?? false,
  )
  const midTick = getTick(
    midPriceRaw,
    market.tickSpacing,
    params.adjust ?? false,
  )
  const maxTick = getTick(
    maxPriceRaw,
    market.tickSpacing,
    params.adjust ?? false,
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
    pricePoints,
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
  marketConfig: GlobalConfig
  deposit?: boolean | undefined
}

export type KandelParams = PositionKandelParams & {
  stepSize: bigint
  askGives: bigint
  bidGives: bigint
  gasreq: bigint
  baseAmount?: bigint | undefined
  quoteAmount?: bigint | undefined
}

export type ValidateParamsResult = {
  params: KandelParams
  rawParams: RawKandelParams
  minBaseAmount: bigint
  minQuoteAmount: bigint
  minProvision: bigint
  distribution: Distribution
  isValid: boolean
}

export function countBidsAndAsks(distribution: Distribution) {
  let nBids = 0n
  let nAsks = 0n
  for (let i = 0; i < distribution.asks.length; i++) {
    if (distribution.asks[i]!.gives !== 0n) nAsks++
  }
  for (let i = 0; i < distribution.bids.length; i++) {
    if (distribution.bids[i]!.gives !== 0n) nBids++
  }
  return {
    nBids,
    nAsks,
  }
}

export function changeGives(
  distribution: Distribution,
  bidGives: bigint,
  askGives: bigint,
): Distribution {
  for (let i = 0; i < distribution.asks.length; i++) {
    if (distribution.asks[i]!.gives !== 0n)
      distribution.asks[i]!.gives = askGives
    if (distribution.bids[i]!.gives !== 0n)
      distribution.bids[i]!.gives = bidGives
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
    gasreq,
    factor,
    asksLocalConfig,
    bidsLocalConfig,
    marketConfig,
    deposit = false,
  } = params

  let distribution = createGeometricDistribution({
    baseQuoteTickIndex0,
    baseQuoteTickOffset,
    firstAskIndex,
    pricePoints,
    stepSize,
    market,
    askGives: 1n,
    bidGives: 1n,
  })

  const { nBids, nAsks } = countBidsAndAsks(distribution)
  // asks gives base and bids gives quote
  const askGives = nAsks > 0 ? params.baseAmount / nAsks : 0n
  const bidGives = nBids > 0 ? params.quoteAmount / nBids : 0n

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

  const bigintFactor = BigInt(factor * 10_000)

  const minAsk = (minVolume(asksLocalConfig, gasreq) * bigintFactor) / 10_000n
  const minBid = (minVolume(bidsLocalConfig, gasreq) * bigintFactor) / 10_000n

  const minBaseAmount = minAsk * nAsks
  const minQuoteAmount = minBid * nBids

  const minProvision =
    ((gasreq + asksLocalConfig.offer_gasbase) *
      BigInt(distribution.asks.length) +
      (gasreq + bidsLocalConfig.offer_gasbase) *
        BigInt(distribution.bids.length)) *
    marketConfig.gasprice *
    BigInt(1e6)

  const isValid =
    (nAsks === 0n || askGives >= minAsk) && (nBids === 0n || bidGives >= minBid)

  return {
    params: {
      baseQuoteTickIndex0,
      baseQuoteTickOffset,
      firstAskIndex,
      stepSize,
      askGives,
      bidGives,
      gasreq,
      pricePoints,
      baseAmount: deposit ? baseAmount : undefined,
      quoteAmount: deposit ? quoteAmount : undefined,
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
    isValid,
    distribution,
  }
}

export type GetKandelGasReqParams = {
  baseLogic?: Logic | undefined
  quoteLogic?: Logic | undefined
}

export function getKandelGasReq(params: GetKandelGasReqParams) {
  return (
    BigInt(
      Math.max(
        Number(params.baseLogic?.gasreq || 0),
        Number(params.quoteLogic?.gasreq || 0),
        Number(getDefaultLimitOrderGasreq()),
      ),
    ) + 100_000n
  )
}
