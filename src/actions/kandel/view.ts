import {
  type Address,
  type Client,
  type MulticallParameters,
  erc20Abi,
} from 'viem'
import { multicall } from 'viem/actions'
import {
  baseQuoteTickOffsetParams,
  getOfferParams,
  kandelParamsParams,
  offerIdOfIndexParams,
  offeredVolumeParams,
  provisionOfParams,
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

export type GetKandelStateParams = {}

export type GetKandelStateArgs = GetKandelStateParams &
  Omit<MulticallParameters, 'contracts' | 'allowFailure'>

type OfferParsed = {
  id: bigint
  tick: bigint
  gives: bigint
  price: number
  ba: BA
  index: bigint
  provision: bigint
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
  asks: OfferParsed[]
  bids: OfferParsed[]
}

export async function getKandelState(
  client: Client,
  actionsParams: MangroveActionsDefaultParams,
  market: MarketParams,
  kandel: Address,
  args: GetKandelStateArgs,
): Promise<GetKandelStateResult> {
  const [
    baseQuoteTickOffset,
    params,
    quoteAmount,
    baseAmount,
    unlockedProvision,
  ] = await getAction(
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
      {
        address: actionsParams.mgv,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [kandel],
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
        if (bidId > 0n) {
          bids.push({
            ...bid,
            index: BigInt(index / 4),
            id: bidId,
            price: rawPriceToHumanPrice(priceFromTick(-bid.tick), market),
            ba: BA.bids,
            provision: 0n,
          })
        }
      }
      if (rawAsk?.status === 'success' && rawAskId?.status === 'success') {
        const ask = unpackOffer(rawAsk.result)
        const askId = rawAskId.result
        if (askId > 0n) {
          asks.push({
            ...ask,
            index: BigInt(index / 4),
            id: askId,
            price: rawPriceToHumanPrice(priceFromTick(ask.tick), market),
            ba: BA.asks,
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
            ...provisionOfParams(bidsMarket, bid.id),
          })),
          ...asks.map((ask) => ({
            address: kandel,
            ...provisionOfParams(asksMarket, ask.id),
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

  return {
    baseQuoteTickOffset:
      baseQuoteTickOffset.status === 'success'
        ? baseQuoteTickOffset.result
        : 0n,
    gasprice: params.status === 'success' ? params.result.gasprice : 0,
    gasreq: params.status === 'success' ? params.result.gasreq : 0,
    stepSize: params.status === 'success' ? params.result.stepSize : 0,
    pricePoints,
    unlockedProvision:
      unlockedProvision.status === 'success' ? unlockedProvision.result : 0n,
    quoteAmount: quoteAmount.status === 'success' ? quoteAmount.result : 0n,
    baseAmount: baseAmount.status === 'success' ? baseAmount.result : 0n,
    asks,
    bids,
  }
}
