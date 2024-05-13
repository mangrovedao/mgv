import type { Address, Client, MulticallParameters } from 'viem'
import { getAction } from '../../utils/getAction.js'
import { multicall } from 'viem/actions'
import {
  baseQuoteTickOffsetParams,
  kandelParamsParams,
  offeredVolumeParams,
  getOfferParams,
} from '../../builder/kandel/view.js'
import { BA } from '../../lib/enums.js'
import { priceFromTick, type MarketParams } from '../../index.js'
import { unpackOffer } from '../../lib/offer.js'
import { rawPriceToHumanPrice } from '~mgv/lib/human-readable.js'

export type GetKandelStateParams = {}

export type GetKandelStateArgs = GetKandelStateParams &
  Omit<MulticallParameters, 'contracts' | 'allowFailure'>

type OfferParsed = {
  tick: bigint
  gives: bigint
  price: number
  ba: BA
  index: bigint
}

export type GetKandelStateResult = {
  baseQuoteTickOffset: bigint
  gasprice: number
  gasreq: number
  stepSize: number
  pricePoints: number
  quoteAmount: bigint
  baseAmount: bigint
  asks: OfferParsed[]
  bids: OfferParsed[]
}

export async function getKandelState(
  client: Client,
  market: MarketParams,
  kandel: Address,
  args: GetKandelStateArgs,
): Promise<GetKandelStateResult> {
  const [baseQuoteTickOffset, params, quoteAmount, baseAmount] =
    await getAction(
      client,
      multicall,
      'multicall',
    )({
      ...args,
      contracts: [
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
      ],
      allowFailure: true,
    })

  const pricePoints =
    params.status === 'success' ? params.result.pricePoints : 0

  const asks: OfferParsed[] = []
  const bids: OfferParsed[] = []
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
      ]),
    })

    asks.push(
      ...offers
        .filter((_, i) => i % 2 === 1)
        .flatMap((offer, index) =>
          offer.status === 'success'
            ? { ...unpackOffer(offer.result), index: BigInt(index) }
            : [],
        )
        .filter((o) => o.gives > 0n)
        .map((offer) => ({
          ...offer,
          ba: BA.asks,
          price: rawPriceToHumanPrice(priceFromTick(-offer.tick), market),
        })),
    )
    bids.push(
      ...offers
        .filter((_, i) => i % 2 === 0)
        .flatMap((offer, index) =>
          offer.status === 'success'
            ? { ...unpackOffer(offer.result), index: BigInt(index) }
            : [],
        )
        .filter((o) => o.gives > 0n)
        .map((offer) => ({
          ...offer,
          ba: BA.bids,
          price: rawPriceToHumanPrice(priceFromTick(offer.tick), market),
        })),
    )
  }

  return {
    baseQuoteTickOffset:
      baseQuoteTickOffset.status === 'success'
        ? baseQuoteTickOffset.result
        : 0n,
    gasprice: params.status === 'success' ? params.result.gasprice : 0,
    gasreq: params.status === 'success' ? params.result.gasreq : 0,
    stepSize: params.status === 'success' ? params.result.stepSize : 0,
    pricePoints,
    quoteAmount: quoteAmount.status === 'success' ? quoteAmount.result : 0n,
    baseAmount: baseAmount.status === 'success' ? baseAmount.result : 0n,
    asks,
    bids,
  }
}
