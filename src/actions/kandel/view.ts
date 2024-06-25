import {
  type Address,
  type Client,
  type MulticallParameters,
  erc20Abi,
  isAddressEqual,
} from 'viem'
import { multicall } from 'viem/actions'
import {
  baseQuoteTickOffsetParams,
  getOfferParams,
  kandelParamsParams,
  offerIdOfIndexParams,
  offeredVolumeParams,
  provisionOfParams,
  baseParams,
  quoteParams,
  tickSpacingParams,
} from '../../builder/kandel/view.js'
import {
  type MangroveActionsDefaultParams,
  type MarketParams,
  priceFromTick,
} from '../../index.js'
import { BA } from '../../lib/enums.js'
import { rawPriceToHumanPrice } from '../../lib/human-readable.js'
import { unpackOffer } from '../../lib/offer.js'
import { getSemibooksOLKeys } from '../../lib/ol-key.js'
import { getAction } from '../../utils/getAction.js'
import { getBookParams, parseBookResult } from '../../builder/book.js'

export type GetKandelStateParams = {}

export type GetKandelStateArgs = GetKandelStateParams &
  Omit<MulticallParameters, 'contracts' | 'allowFailure'>

export type OfferParsed = {
  id: bigint
  tick: bigint
  gives: bigint
  price: number
  ba: BA
  index: bigint
  provision: bigint
}

export enum KandelStatus {
  Active = 'active',
  OutOfRange = 'out-of-range',
  Inactive = 'inactive',
  Closed = 'closed',
}

export type GetKandelStateResult = {
  baseQuoteTickOffset: bigint
  gasprice: number
  gasreq: number
  stepSize: number
  pricePoints: number
  quoteAmount: bigint
  baseAmount: bigint
  unlockedProvision: bigint
  kandelStatus: KandelStatus
  asks: OfferParsed[]
  bids: OfferParsed[]
  reversed: boolean
}

type KandelInitCallResult = {
  baseQuoteTickOffset: bigint
  params: {
    gasprice: number
    gasreq: number
    stepSize: number
    pricePoints: number
  }
  baseAmount: bigint
  quoteAmount: bigint
  unlockedProvision: bigint
  // mid price from the book
  midPrice: number
  // whether the base quote is reversed
  reversed: boolean
}

async function kandelInitCall(
  client: Client,
  actionsParams: MangroveActionsDefaultParams,
  market: MarketParams,
  kandel: Address,
  args: GetKandelStateArgs,
): Promise<KandelInitCallResult> {
  const { asksMarket, bidsMarket } = getSemibooksOLKeys(market)
  const [
    bestAsk,
    bestBid,
    baseQuoteTickOffset,
    params,
    _quoteAmount,
    _baseAmount,
    _base,
    _quote,
    _tickSpacing,
    unlockedProvision,
  ] = await getAction(
    client,
    multicall,
    'multicall',
  )({
    ...args,
    contracts: [
      {
        address: actionsParams.mgvReader,
        ...getBookParams({
          olKey: asksMarket,
          maxOffers: 1n,
        }),
      },
      {
        address: actionsParams.mgvReader,
        ...getBookParams({
          olKey: bidsMarket,
          maxOffers: 1n,
        }),
      },
      {
        address: kandel,
        ...baseQuoteTickOffsetParams,
      },
      {
        address: kandel,
        ...kandelParamsParams,
      },
      {
        address: kandel,
        ...offeredVolumeParams(BA.bids),
      },
      {
        address: kandel,
        ...offeredVolumeParams(BA.asks),
      },
      {
        address: kandel,
        ...baseParams,
      },
      {
        address: kandel,
        ...quoteParams,
      },
      {
        address: kandel,
        ...tickSpacingParams,
      },
      {
        address: actionsParams.mgv,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [kandel],
      },
    ],
    allowFailure: true,
  })

  let reversed = false
  const [base, quote, tickSpacing] = [
    _base.result,
    _quote.result,
    _tickSpacing.result,
  ]
  if (!base || !quote || !tickSpacing)
    throw new Error('Could not fetch base, quote or tickSpacing')
  if (
    isAddressEqual(market.base.address, quote) &&
    isAddressEqual(market.quote.address, base) &&
    market.tickSpacing === tickSpacing
  ) {
    reversed = true
  } else if (
    !isAddressEqual(market.base.address, base) ||
    !isAddressEqual(market.quote.address, quote) ||
    tickSpacing !== market.tickSpacing
  ) {
    throw new Error('Market does not match kandel')
  }

  const baseAmount = _baseAmount.status === 'success' ? _baseAmount.result : 0n
  const quoteAmount =
    _quoteAmount.status === 'success' ? _quoteAmount.result : 0n

  const asks =
    bestAsk.status === 'success'
      ? parseBookResult({
          result: bestAsk.result,
          ba: BA.asks,
          baseDecimals: market.base.decimals,
          quoteDecimals: market.quote.decimals,
        })
      : []

  const bids =
    bestBid.status === 'success'
      ? parseBookResult({
          result: bestBid.result,
          ba: BA.bids,
          baseDecimals: market.base.decimals,
          quoteDecimals: market.quote.decimals,
        })
      : []

  const minAskPrice = asks[0]?.price
  const maxBidPrice = bids[0]?.price

  const midPrice =
    minAskPrice && maxBidPrice
      ? (minAskPrice + maxBidPrice) / 2
      : minAskPrice
        ? minAskPrice
        : maxBidPrice
          ? maxBidPrice
          : 1

  return {
    baseQuoteTickOffset:
      baseQuoteTickOffset.status === 'success'
        ? baseQuoteTickOffset.result
        : 0n,
    params:
      params.status === 'success'
        ? params.result
        : { gasprice: 0, gasreq: 0, stepSize: 0, pricePoints: 0 },
    baseAmount: reversed ? quoteAmount : baseAmount,
    quoteAmount: reversed ? baseAmount : quoteAmount,
    reversed,
    unlockedProvision:
      unlockedProvision.status === 'success' ? unlockedProvision.result : 0n,
    midPrice,
  }
}

type GetKandelBidsAndAskResult = {
  asks: OfferParsed[]
  bids: OfferParsed[]
}

async function kandelBidsAndAsks(
  client: Client,
  market: MarketParams,
  kandel: Address,
  args: GetKandelStateArgs & {
    pricePoints: number
    reversed: boolean
  },
): Promise<GetKandelBidsAndAskResult> {
  const asks: OfferParsed[] = []
  const bids: OfferParsed[] = []
  const pricePoints = args.pricePoints
  if (pricePoints > 0) {
    const offers = await getAction(
      client,
      multicall,
      'multicall',
    )({
      ...args,
      allowFailure: true,
      contracts: Array.from({ length: pricePoints }).flatMap((_, i) => [
        {
          address: kandel,
          ...getOfferParams(BA.bids, BigInt(i)),
        },
        {
          address: kandel,
          ...getOfferParams(BA.asks, BigInt(i)),
        },
        {
          address: kandel,
          ...offerIdOfIndexParams(BA.bids, BigInt(i)),
        },
        {
          address: kandel,
          ...offerIdOfIndexParams(BA.asks, BigInt(i)),
        },
      ]),
    })

    if (offers.length !== pricePoints * 4) {
      throw new Error('unexpected number of offers')
    }

    for (let index = 0; index < offers.length; index += 4) {
      const [rawBid, rawAsk, rawBidId, rawAskId] = offers.slice(
        index,
        index + 4,
      )
      if (rawBid?.status === 'success' && rawBidId?.status === 'success') {
        const bid = unpackOffer(rawBid.result)
        const bidId = rawBidId.result
        const reversedMultiplier = args.reversed ? 1n : -1n
        if (bidId > 0n) {
          bids.push({
            ...bid,
            index: BigInt(index / 4),
            id: bidId,
            price: rawPriceToHumanPrice(
              priceFromTick(bid.tick * reversedMultiplier),
              market,
            ),
            ba: args.reversed ? BA.asks : BA.bids,
            provision: 0n,
          })
        }
      }
      if (rawAsk?.status === 'success' && rawAskId?.status === 'success') {
        const ask = unpackOffer(rawAsk.result)
        const askId = rawAskId.result
        const reversedMultiplier = args.reversed ? -1n : 1n
        if (askId > 0n) {
          asks.push({
            ...ask,
            index: BigInt(index / 4),
            id: askId,
            price: rawPriceToHumanPrice(
              priceFromTick(ask.tick * reversedMultiplier),
              market,
            ),
            ba: args.reversed ? BA.bids : BA.asks,
            provision: 0n,
          })
        }
      }
    }

    if (bids.length || asks.length) {
      const { asksMarket, bidsMarket } = getSemibooksOLKeys(market)
      const provisions = await getAction(
        client,
        multicall,
        'multicall',
      )({
        allowFailure: true,
        ...args,
        contracts: [
          ...bids.map((bid) => ({
            address: kandel,
            ...provisionOfParams(
              args.reversed ? asksMarket : bidsMarket,
              bid.id,
            ),
          })),
          ...asks.map((ask) => ({
            address: kandel,
            ...provisionOfParams(
              args.reversed ? bidsMarket : asksMarket,
              ask.id,
            ),
          })),
        ],
      })
      for (let i = 0; i < bids.length && i < provisions.length; i++) {
        if (bids[i]!.gives === 0n) continue
        const value = provisions[i]
        const provision = value?.status === 'success' ? value.result : 0n
        bids[i]!.provision = provision
      }
      for (
        let i = 0;
        i < asks.length && i + bids.length < provisions.length;
        i++
      ) {
        if (asks[i]!.gives === 0n) continue
        const value = provisions[i + bids.length]
        const provision = value?.status === 'success' ? value.result : 0n
        asks[i]!.provision = provision
      }
    }
  }

  if (args.reversed) return { asks: bids, bids: asks }
  return { asks, bids }
}

function kandelStatus(
  { asks, bids }: GetKandelBidsAndAskResult,
  unlockedProvision: bigint,
  midPrice: number,
): KandelStatus {
  // if no offers and no provision, closed
  const hasAsks = asks.some((ask) => ask.gives > 0n)
  const hasBids = bids.some((bid) => bid.gives > 0n)
  if (!hasAsks && !hasBids && unlockedProvision === 0n) {
    return KandelStatus.Closed
  }

  // if no offers and provision, inactive
  if (!hasAsks && !hasBids) {
    return KandelStatus.Inactive
  }
  // if offers and midPrice in range, active
  const minPrice = Math.min(
    ...asks.map((ask) => ask.price),
    ...bids.map((bid) => bid.price),
  )
  const maxPrice = Math.max(
    ...asks.map((ask) => ask.price),
    ...bids.map((bid) => bid.price),
  )
  if (midPrice >= minPrice && midPrice <= maxPrice) {
    return KandelStatus.Active
  }
  // if offers and midPrice out of range, out of range
  return KandelStatus.OutOfRange
}

export async function getKandelState(
  client: Client,
  actionsParams: MangroveActionsDefaultParams,
  market: MarketParams,
  kandel: Address,
  args: GetKandelStateArgs,
): Promise<GetKandelStateResult> {
  const { params, reversed, unlockedProvision, midPrice, ...rest } =
    await kandelInitCall(client, actionsParams, market, kandel, args)

  const result = await kandelBidsAndAsks(client, market, kandel, {
    ...args,
    pricePoints: params.pricePoints,
    reversed,
  })

  return {
    ...rest,
    ...params,
    ...result,
    unlockedProvision,
    kandelStatus: kandelStatus(result, unlockedProvision, midPrice),
    reversed,
  }
}
