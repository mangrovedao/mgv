import { type Address, type Log, isAddressEqual, parseEventLogs } from 'viem'
import type {
  MangroveActionsDefaultParams,
  MarketParams,
} from '../types/index.js'
import type { OLKey } from '../types/lib.js'
import { BS } from './enums.js'
import { mgvEventsABI, rawMarketOrderResultFromLogs } from './market-order.js'
import { flip, hash } from './ol-key.js'
import { inboundFromOutbound } from './tick.js'

export type RawLimitOrderResultFromLogsParams = {
  logs: Log[]
  user: Address
  olKey: OLKey
  mgv: Address
}

export type LimitOrderResult = {
  takerGot: bigint
  takerGave: bigint
  bounty: bigint
  feePaid: bigint
  offer?: {
    id: bigint
    tick: bigint
    gives: bigint
    wants: bigint
    gasprice: bigint
    gasreq: bigint
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
    abi: mgvEventsABI,
    eventName: 'OfferWrite',
    logs: params.logs.filter((log) => isAddressEqual(log.address, params.mgv)),
  })
  const loKeyHash = hash(flip(params.olKey)).toLowerCase()
  for (const event of events) {
    if (
      event.args.olKeyHash !== loKeyHash ||
      !isAddressEqual(params.user, event.args.maker)
    )
      continue
    const { tick, gives, gasprice, gasreq, id } = event.args
    return {
      ...marketOrderResult,
      offer: {
        id,
        tick,
        gives,
        wants: inboundFromOutbound(tick, gives),
        gasprice,
        gasreq,
      },
    }
  }
  return marketOrderResult
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
