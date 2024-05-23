import {
  type Address,
  type Log,
  isAddressEqual,
  parseAbi,
  parseEventLogs,
  zeroAddress,
} from 'viem'
import type {
  MangroveActionsDefaultParams,
  MarketParams,
} from '../types/index.js'
import type { OLKey } from '../types/lib.js'
import { BS, Order } from './enums.js'
import { mgvEventsABI, rawMarketOrderResultFromLogs } from './market-order.js'
import { flip, hash } from './ol-key.js'
import { inboundFromOutbound } from './tick.js'

export const mgvOrderEventsABI = parseAbi([
  'event MangroveOrderStart(bytes32 indexed olKeyHash,address indexed taker,int tick,uint8 orderType,uint fillVolume,bool fillWants,uint offerId,address takerGivesLogic,address takerWantsLogic)',
  'event MangroveOrderComplete()',
  'event SetReneging(bytes32 indexed olKeyHash, uint indexed offerId, uint date, uint volume)',
])

export type RawLimitOrderResultFromLogsParams = {
  logs: Log[]
  user: Address
  olKey: OLKey
  mgv: Address
  mgvOrder: Address
}

export type LimitOrderResult = {
  takerGot: bigint
  takerGave: bigint
  bounty: bigint
  feePaid: bigint
  takerGivesLogic?: Address
  takerWantsLogic?: Address
  offer?: {
    id: bigint
    tick: bigint
    gives: bigint
    wants: bigint
    gasprice: bigint
    gasreq: bigint
    expiry?: bigint
  }
}

export function rawLimitOrderResultFromLogs(
  params: RawLimitOrderResultFromLogsParams,
): LimitOrderResult {
  const marketOrderResult = rawMarketOrderResultFromLogs({
    ...params,
    taker: params.user,
  })
  const events = parseEventLogs({
    abi: [...mgvEventsABI, ...mgvOrderEventsABI],
    eventName: [
      'OfferWrite',
      'MangroveOrderStart',
      'MangroveOrderComplete',
      'SetReneging',
    ],
    logs: params.logs.filter((log) => {
      return (
        isAddressEqual(log.address, params.mgv) ||
        isAddressEqual(log.address, params.mgvOrder)
      )
    }),
  })
  const loKeyHash = hash(flip(params.olKey)).toLowerCase()
  const olKeyHash = hash(params.olKey).toLowerCase()
  const startIndex = events.findIndex(
    (event) =>
      event.eventName === 'MangroveOrderStart' &&
      event.args.olKeyHash.toLowerCase() === olKeyHash &&
      isAddressEqual(event.args.taker, params.user),
  )
  if (startIndex === -1) return marketOrderResult
  let endIndex = startIndex + 1
  let _depth = 0
  for (; endIndex < events.length; endIndex++) {
    if (events[endIndex].eventName === 'MangroveOrderStart') {
      _depth++
    } else if (events[endIndex].eventName === 'MangroveOrderComplete') {
      if (_depth === 0) break
      _depth--
    }
  }
  const mangroveOrderStartEvent = events[startIndex] as Log<
    bigint,
    number,
    false,
    undefined,
    true,
    typeof mgvOrderEventsABI,
    'MangroveOrderStart'
  >
  const offerWriteEventIndex = events
    .slice(startIndex, endIndex)
    .findLastIndex((l) => {
      return (
        l.eventName === 'OfferWrite' &&
        l.args.olKeyHash.toLowerCase() === loKeyHash &&
        isAddressEqual(l.args.maker, params.mgvOrder)
      )
    })

  const takerGivesLogic = isAddressEqual(
    mangroveOrderStartEvent.args.takerGivesLogic,
    zeroAddress,
  )
    ? undefined
    : mangroveOrderStartEvent.args.takerGivesLogic

  const takerWantsLogic = isAddressEqual(
    mangroveOrderStartEvent.args.takerWantsLogic,
    zeroAddress,
  )
    ? undefined
    : mangroveOrderStartEvent.args.takerWantsLogic
  if (offerWriteEventIndex === -1)
    return {
      ...marketOrderResult,
      takerGivesLogic,
      takerWantsLogic,
    }
  const offerWriteEvent = events[offerWriteEventIndex] as Log<
    bigint,
    number,
    false,
    undefined,
    true,
    typeof mgvEventsABI,
    'OfferWrite'
  >
  const expiryEvent = events
    .slice(offerWriteEventIndex, endIndex)
    .findLast((e) => {
      return (
        e.eventName === 'SetReneging' &&
        e.args.offerId === offerWriteEvent.args.id
      )
    }) as
    | Log<
        bigint,
        number,
        false,
        undefined,
        true,
        typeof mgvOrderEventsABI,
        'SetReneging'
      >
    | undefined
  return {
    ...marketOrderResult,
    takerGivesLogic,
    takerWantsLogic,
    offer: {
      id: offerWriteEvent.args.id,
      tick: offerWriteEvent.args.tick,
      gives: offerWriteEvent.args.gives,
      wants: inboundFromOutbound(
        offerWriteEvent.args.tick,
        offerWriteEvent.args.gives,
      ),
      gasprice: offerWriteEvent.args.gasprice,
      gasreq: offerWriteEvent.args.gasreq,
      expiry: expiryEvent?.args.date,
    },
  }
}

export type LimitOrderResultFromLogsParams = {
  logs: Log[]
  user: Address
  bs: BS
}

export function limitOrderResultFromLogs(
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: LimitOrderResultFromLogsParams,
): LimitOrderResult {
  const { base, quote, tickSpacing } = market
  const olKey: OLKey =
    BS.buy === params.bs
      ? {
          outbound_tkn: base.address,
          inbound_tkn: quote.address,
          tickSpacing,
        }
      : {
          outbound_tkn: quote.address,
          inbound_tkn: base.address,
          tickSpacing,
        }
  return rawLimitOrderResultFromLogs({
    ...params,
    mgv: actionParams.mgv,
    mgvOrder: actionParams.mgvOrder,
    olKey,
  })
}

export type GetDefaultLimitOrderGasreqParams = {
  chainId?: bigint
  mgvOrder?: Address
}

export function getDefaultLimitOrderGasreq(): bigint {
  return 250_000n
}

const _orderLabel = {
  [Order.GTC]: 'Good Til Cancelled',
  [Order.GTCE]: 'Good Til Cancelled Enforced',
  [Order.PO]: 'Post Only',
  [Order.IOC]: 'Immediate Or Cancel',
  [Order.FOK]: 'Fill Or Kill',
} as const satisfies { [key in Order]: string }

export function orderLabel<TOrder extends Order = Order>(
  order: TOrder,
): (typeof _orderLabel)[TOrder] {
  return _orderLabel[order]
}

export type RawUpdateOrderResultFromLogsParams = {
  logs: Log[]
  mgv: Address
  mgvOrder: Address
  olKey: OLKey
  offerId: bigint
}

export type UpdateOrderResult = {
  tick: bigint
  gives: bigint
  wants: bigint
  gasprice: bigint
  gasreq: bigint
}

export class ParseUpdateOrderLogsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseUpdateOrderLogsError'
  }
}

export function rawUpdateOrderResultFromLogs(
  params: RawUpdateOrderResultFromLogsParams,
): UpdateOrderResult {
  const events = parseEventLogs({
    abi: mgvEventsABI,
    eventName: 'OfferWrite',
    logs: params.logs.filter((log) => {
      return isAddressEqual(log.address, params.mgv)
    }),
  })

  const writeEvent = events.findLast((e) => {
    return (
      e.args.olKeyHash.toLowerCase() === hash(params.olKey).toLowerCase() &&
      isAddressEqual(e.args.maker, params.mgvOrder)
    )
  })

  if (!writeEvent)
    throw new ParseUpdateOrderLogsError('OfferWrite event not found')

  return {
    tick: writeEvent.args.tick,
    gives: writeEvent.args.gives,
    wants: inboundFromOutbound(writeEvent.args.tick, writeEvent.args.gives),
    gasprice: writeEvent.args.gasprice,
    gasreq: writeEvent.args.gasreq,
  }
}

export type UpdateOrderResultFromLogsParams = {
  logs: Log[]
  offerId: bigint
  bs: BS
}

export function updateOrderResultFromLogs(
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: UpdateOrderResultFromLogsParams,
): UpdateOrderResult {
  const {
    base: { address: base },
    quote: { address: quote },
    tickSpacing,
  } = market
  // if we buy, the resulting order has outbound as quote and inbound as base
  // if we sell, the resulting order has outbound as base and inbound as quote
  const olKey: OLKey =
    params.bs === BS.buy
      ? { outbound_tkn: quote, inbound_tkn: base, tickSpacing }
      : { outbound_tkn: base, inbound_tkn: quote, tickSpacing }

  return rawUpdateOrderResultFromLogs({
    ...params,
    ...actionParams,
    olKey,
  })
}

export type RawSetExpirationResultFromLogsParams = {
  logs: Log[]
  olKey: OLKey
  offerId: bigint
  mgvOrder: Address
}

export function rawSetExpirationResultFromLogs(
  params: RawSetExpirationResultFromLogsParams,
): bigint | undefined {
  const events = parseEventLogs({
    abi: mgvOrderEventsABI,
    eventName: 'SetReneging',
    logs: params.logs.filter((log) => {
      return isAddressEqual(log.address, params.mgvOrder)
    }),
  })

  const expiryEvent = events.findLast((e) => {
    return (
      e.args.offerId === params.offerId &&
      e.args.olKeyHash.toLowerCase() === hash(params.olKey).toLowerCase()
    )
  })

  return expiryEvent?.args.date
}

export type SetExpirationResultFromLogsParams = {
  logs: Log[]
  offerId: bigint
  bs: BS
}

export function setExpirationResultFromLogs(
  actionsParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: SetExpirationResultFromLogsParams,
): bigint | undefined {
  const {
    base: { address: base },
    quote: { address: quote },
    tickSpacing,
  } = market
  const olKey: OLKey =
    params.bs === BS.buy
      ? { outbound_tkn: quote, inbound_tkn: base, tickSpacing }
      : { outbound_tkn: base, inbound_tkn: quote, tickSpacing }
  return rawSetExpirationResultFromLogs({
    ...params,
    ...actionsParams,
    olKey,
  })
}
