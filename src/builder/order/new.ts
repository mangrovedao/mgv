import {
  type Address,
  type ContractFunctionParameters,
  parseAbi,
  zeroAddress,
} from 'viem'
import { BS, Order } from '../../lib/enums.js'
import { tickFromVolumes } from '../../lib/tick.js'
import type { Book } from '../../types/actions/book.js'
import type { MarketParams } from '../../types/actions/index.js'
import type { GlobalConfig, LocalConfig, OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const limitOrderABI = parseAbi([
  olKeyABIRaw,
  'struct TakerOrder { OLKey olKey; int tick; uint8 orderType; uint fillVolume; bool fillWants; uint expiryDate; uint offerId; uint restingOrderGasreq; address takerGivesLogic; address takerWantsLogic;}',
  'struct TakerOrderResult { uint takerGot; uint takerGave; uint bounty; uint fee; uint offerId; bytes32 offerWriteData;}',
  'function take(TakerOrder calldata tko) external payable returns (TakerOrderResult memory res)',
  'function router(address fundOwner) public view returns (address)',
])

export type GetUserRouterParams = {
  user: Address
}

export function getUserRouterParams(params: GetUserRouterParams) {
  return {
    abi: limitOrderABI,
    functionName: 'router',
    args: [params.user],
  } satisfies Omit<
    ContractFunctionParameters<typeof limitOrderABI, 'view', 'router'>,
    'address'
  >
}

// buy => get base, send quote => when taker, outbound is base, inbound is quote, when maker outbound is quote, inbound is base
// sell => get quote, send base => when taker, outbound is quote, inbound is base, when maker outbound is base, inbound is quote

// asks => outbound is base, inbound is quote
// bids => outbound is quote, inbound is base

/**
 * Parameters for a limit order.
 * @param olKey the OLKey object
 * This must be the olKey as a taker
 * If we want to buy, then outbound is base, inbound is quote
 * If we want to sell, then outbound is quote, inbound is base
 * @param tick the tick of the order
 * This is the tick corresponding to the price as a taker
 * If we want to buy, then price is quote/base, else base/quote
 * @param restingOrderGasreq the gas required for the resting order
 * @param localConfig the market local config for the list we post on
 * If we are buying, then the bids market config, else the asks market config
 * @param globalConfig the global config
 * @param fillVolume the volume to fill
 * @param orderType the order type
 * @param fillWants whether the fillVolume is the amount to give or to take
 * @param expiryDate the expiry date of the order
 * @param offerId the offer id of the order
 * @param takerGivesLogic the taker gives logic
 * @param takerWantsLogic the taker wants logic
 */
export type RawLimitOrderParams = {
  olKey: OLKey
  tick: bigint
  restingOrderGasreq: bigint
  localConfig: LocalConfig
  globalConfig: GlobalConfig
  fillVolume: bigint
  orderType?: Order
  fillWants?: boolean
  expiryDate?: bigint
  offerId?: bigint
  takerGivesLogic?: Address
  takerWantsLogic?: Address
  value?: bigint
}

export function rawLimitOrderParams(params: RawLimitOrderParams) {
  const {
    olKey,
    tick,
    restingOrderGasreq,
    localConfig,
    globalConfig,
    fillVolume,
    orderType = Order.GTC,
    fillWants = true,
    expiryDate = 0n,
    offerId = 0n,
    takerGivesLogic = zeroAddress,
    takerWantsLogic = zeroAddress,
    value = globalConfig.gasprice *
      (restingOrderGasreq + localConfig.offer_gasbase) *
      BigInt(1e6),
  } = params

  return {
    abi: limitOrderABI,
    functionName: 'take',
    args: [
      {
        olKey,
        tick,
        orderType,
        fillVolume,
        fillWants,
        expiryDate,
        offerId,
        restingOrderGasreq,
        takerGivesLogic,
        takerWantsLogic,
      },
    ],
    value,
  } satisfies Omit<
    ContractFunctionParameters<typeof limitOrderABI, 'payable', 'take'>,
    'address'
  > & { value: bigint }
}

/**
 * Parameters for a limit order.
 * @param baseAmount the amount of base token
 * @param quoteAmount the amount of quote token
 * @param restingOrderGasreq the gas required for the resting order
 * @param bs the buy/sell direction
 * @param book the book to post the order on
 * @param orderType the order type
 * @param fillWants whether to fill the wants or the gives
 * @param expiryDate the expiry date of the order
 * @param offerId the offer id of the order
 * @param takerGivesLogic the taker gives logic
 * @param takerWantsLogic the taker wants logic
 * @param value the value to send with the transaction
 */
export type LimitOrderParams = {
  baseAmount: bigint
  quoteAmount: bigint
  restingOrderGasreq: bigint
  bs: BS
  book: Book
  orderType?: Order
  fillWants?: boolean
  expiryDate?: bigint
  offerId?: bigint
  takerGivesLogic?: Address
  takerWantsLogic?: Address
  value?: bigint
}

export function limitOrderParams(
  market: MarketParams,
  params: LimitOrderParams,
) {
  const {
    baseAmount,
    quoteAmount,
    restingOrderGasreq,
    book,
    bs,
    orderType = Order.GTC,
    fillWants = bs === BS.buy,
    expiryDate = 0n,
    offerId = 0n,
    takerGivesLogic = zeroAddress,
    takerWantsLogic = zeroAddress,
    value,
  } = params
  const { base, quote, tickSpacing } = market

  const [olKey, tick, localConfig, fillVolume] =
    bs === BS.buy
      ? [
          // if buying the market we confront for market orders is the one selling base
          // because we want to buy base
          {
            outbound_tkn: base.address,
            inbound_tkn: quote.address,
            tickSpacing,
          },
          // The price is the one from the initial market we buy from
          // so the price is quote/base
          tickFromVolumes(quoteAmount, baseAmount),
          // This is the config of the market we will be posting the resting order on
          // the bids are sending quote and receiving base
          book.bidsConfig,
          // the wants is in terms of the base token
          fillWants ? baseAmount : quoteAmount,
        ]
      : [
          // if selling the market we confront for market orders is the one buying base
          // because we want to sell base
          {
            outbound_tkn: quote.address,
            inbound_tkn: base.address,
            tickSpacing,
          },
          // The price is the one from the initial market we sell to
          // so the price is base/quote
          tickFromVolumes(baseAmount, quoteAmount),
          // This is the config of the market we will be posting the resting order on
          // the asks are sending base and receiving quote
          book.asksConfig,
          // the wants is in terms of the quote token
          fillWants ? quoteAmount : baseAmount,
        ]

  return rawLimitOrderParams({
    olKey,
    tick,
    restingOrderGasreq,
    localConfig,
    globalConfig: book.marketConfig,
    fillVolume,
    orderType,
    fillWants,
    expiryDate,
    offerId,
    takerGivesLogic,
    takerWantsLogic,
    value,
  })
}
