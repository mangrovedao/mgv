import {
  type Address,
  type Client,
  type MulticallParameters,
  isAddressEqual,
  zeroAddress,
} from 'viem'
import { multicall } from 'viem/actions'
import { viewOfferParams } from '../../builder/offer/view.js'
import {
  viewExpirationParams,
  viewLimitOrderLogicsParams,
  viewProvisionParams,
} from '../../builder/order/view.js'
import { BA } from '../../lib/enums.js'
import { rpcOfferToHumanOffer } from '../../lib/human-readable.js'
import { unpackOfferDetail } from '../../lib/offer-detail.js'
import { unpackOffer } from '../../lib/offer.js'
import { getSemibooksOLKeys } from '../../lib/ol-key.js'
import type {
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/index.js'
import type { CompleteOffer, RpcCompleteOffer } from '../../types/lib.js'
import { getAction } from '../../utils/getAction.js'

export type OrderResult = CompleteOffer & {
  provision: bigint
  isLive: boolean
  expiry?: bigint | undefined
  baseLogic?: Address | undefined
  quoteLogic?: Address | undefined
}

export type GetFullOfferParams = {
  offer: RpcCompleteOffer
  market: MarketParams
  ba: BA
  expiry: bigint
  provision: bigint
  baseLogic: Address
  quoteLogic: Address
}

export function getFullOffer(params: GetFullOfferParams): OrderResult {
  const humanOffer = rpcOfferToHumanOffer({
    ba: params.ba,
    ...params.offer.offer,
    baseDecimals: params.market.base.decimals,
    quoteDecimals: params.market.quote.decimals,
  })
  return {
    ...params.offer,
    ...humanOffer,
    expiry: params.expiry === 0n ? undefined : params.expiry,
    provision: params.provision,
    baseLogic: isAddressEqual(params.baseLogic, zeroAddress)
      ? undefined
      : params.baseLogic,
    quoteLogic: isAddressEqual(params.quoteLogic, zeroAddress)
      ? undefined
      : params.quoteLogic,
    isLive:
      (params.expiry === 0n ||
        params.expiry > BigInt(Math.floor(Date.now() / 1000))) &&
      params.offer.offer.gives > 0n,
  }
}

export type GetSingleOrderParams = {
  offerId: bigint
  market: MarketParams
  user: Address
  userRouter: Address
  ba: BA
}

export type GetSingleOrderArgs = GetSingleOrderParams &
  Omit<MulticallParameters, 'contracts' | 'allowFailure'>

export async function getOrder(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: GetSingleOrderArgs,
): Promise<OrderResult> {
  const olKeys = getSemibooksOLKeys(args.market)
  const olKey = BA.asks === args.ba ? olKeys.asksMarket : olKeys.bidsMarket
  const [rawOffers, rawExpiry, rawProvision, rawBaseLogic, rawQuoteLogic] =
    await getAction(
      client,
      multicall,
      'multicall',
    )({
      contracts: [
        {
          address: actionParams.mgv,
          ...viewOfferParams({
            olKey,
            offerId: args.offerId,
          }),
        },
        {
          address: actionParams.mgvOrder,
          ...viewExpirationParams({
            olKey,
            offerId: args.offerId,
          }),
        },
        {
          address: actionParams.mgvOrder,
          ...viewProvisionParams({
            olKey,
            offerId: args.offerId,
          }),
        },
        {
          address: args.userRouter,
          ...viewLimitOrderLogicsParams({
            olKey,
            offerId: args.offerId,
            user: args.user,
            token: args.market.base.address,
          }),
        },
        {
          address: args.userRouter,
          ...viewLimitOrderLogicsParams({
            olKey,
            offerId: args.offerId,
            user: args.user,
            token: args.market.quote.address,
          }),
        },
      ],
      allowFailure: true,
      ...args,
    })

  if (rawOffers.status === 'failure') throw new Error('Failed to get order')

  return getFullOffer({
    ...args,
    offer: {
      id: args.offerId,
      offer: unpackOffer(rawOffers.result[0]),
      detail: unpackOfferDetail(rawOffers.result[1]),
    },
    expiry: rawExpiry.status === 'success' ? rawExpiry.result.date : 0n,
    provision: rawProvision.status === 'success' ? rawProvision.result : 0n,
    baseLogic:
      rawBaseLogic.status === 'success' ? rawBaseLogic.result : zeroAddress,
    quoteLogic:
      rawQuoteLogic.status === 'success' ? rawQuoteLogic.result : zeroAddress,
  })
}

export type GetOrdersParamsSingleMarket = {
  market: MarketParams
  offerId: bigint
  ba: BA
}

export type GetOrdersParams = {
  orders: GetOrdersParamsSingleMarket[]
  user: Address
  userRouter: Address
}

export type GetOrdersArgs = GetOrdersParams &
  Omit<MulticallParameters, 'contracts' | 'allowFailure'>

export async function getOrders(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: GetOrdersArgs,
): Promise<OrderResult[]> {
  const contracts = args.orders.flatMap((o) => {
    const olKeys = getSemibooksOLKeys(o.market)
    const olKey = BA.asks === o.ba ? olKeys.asksMarket : olKeys.bidsMarket
    return [
      {
        address: actionParams.mgv,
        ...viewOfferParams({
          olKey,
          offerId: o.offerId,
        }),
      },
      {
        address: actionParams.mgvOrder,
        ...viewExpirationParams({
          olKey,
          offerId: o.offerId,
        }),
      },
      {
        address: actionParams.mgvOrder,
        ...viewProvisionParams({
          olKey,
          offerId: o.offerId,
        }),
      },
      {
        address: args.userRouter,
        ...viewLimitOrderLogicsParams({
          olKey,
          offerId: o.offerId,
          user: args.user,
          token: o.market.base.address,
        }),
      },
      {
        address: args.userRouter,
        ...viewLimitOrderLogicsParams({
          olKey,
          offerId: o.offerId,
          user: args.user,
          token: o.market.quote.address,
        }),
      },
    ] as const satisfies MulticallParameters['contracts']
  })
  const result = await getAction(
    client,
    multicall,
    'multicall',
  )({
    contracts,
    allowFailure: true,
    ...args,
  })

  // index 0 is the offer and details [bigint, bigint]
  // index 1 is the expiry
  // index 2 is the provision
  // index 3 is the base logic
  // index 4 is the quote logic

  if (result.length !== args.orders.length * 5)
    throw new Error('Invalid result length')

  const orders: OrderResult[] = []

  for (let i = 0; i < result.length; i += 5) {
    const order = args.orders[i / 5]!
    const [rawOffers, rawExpiry, rawProvision, rawBaseLogic, rawQuoteLogic] =
      result.slice(i)
    if (rawOffers?.status !== 'success') throw new Error('Failed to get order')

    orders.push(
      getFullOffer({
        ...order,
        offer: {
          id: order.offerId,
          offer: unpackOffer(
            (rawOffers.result as unknown as readonly [bigint, bigint])[0],
          ),
          detail: unpackOfferDetail(
            (rawOffers.result as unknown as readonly [bigint, bigint])[1],
          ),
        },
        expiry:
          rawExpiry?.status === 'success'
            ? ((rawExpiry.result as any).date as bigint)
            : 0n,
        provision:
          rawProvision?.status === 'success'
            ? (rawProvision.result as bigint)
            : 0n,
        baseLogic:
          rawBaseLogic?.status === 'success'
            ? (rawBaseLogic.result as Address)
            : zeroAddress,
        quoteLogic:
          rawQuoteLogic?.status === 'success'
            ? (rawQuoteLogic.result as Address)
            : zeroAddress,
      }),
    )
  }

  return orders
}
