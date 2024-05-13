import {
  type Address,
  type Log,
  isAddressEqual,
  parseAbi,
  parseEventLogs,
} from 'viem'
import type {
  MangroveActionsDefaultParams,
  MarketOrderResult,
  MarketParams,
  OLKey,
} from '../types/index.js'
import { BS } from './enums.js'
import { hash } from './ol-key.js'

export const mgvEventsABI = parseAbi([
  'event OrderStart(bytes32 indexed olKeyHash, address indexed taker, Tick maxTick, uint fillVolume, bool fillWants)',
  'event OrderComplete(bytes32 indexed olKeyHash, address indexed taker, uint fee)',
  'event OfferSuccess(bytes32 indexed olKeyHash, address indexed taker, uint indexed id, uint takerWants, uint takerGives)',
  'event OfferSuccessWithPosthookData(bytes32 indexed olKeyHash, address indexed taker, uint indexed id, uint takerWants, uint takerGives, bytes32 posthookData)',
  'event OfferFail(bytes32 indexed olKeyHash, address indexed taker, uint indexed id, uint takerWants, uint takerGives, uint penalty, bytes32 mgvData)',
  'event OfferFailWithPosthookData(bytes32 indexed olKeyHash, address indexed taker, uint indexed id, uint takerWants, uint takerGives, uint penalty, bytes32 mgvData, bytes32 posthookData)',
  'event OfferWrite(bytes32 indexed olKeyHash, address indexed maker, int tick, uint gives, uint gasprice, uint gasreq, uint id)',
  'event OfferRetract(bytes32 indexed olKeyHash, address indexed maker, uint id, bool deprovision)',
])

export type RawMarketOrderResultFromLogsParams = {
  logs: Log[]
  olKey: OLKey
  taker: Address
  mgv: Address
}

type Result = Omit<MarketOrderResult, 'request'>

export function rawMarketOrderResultFromLogs(
  params: RawMarketOrderResultFromLogsParams,
): Result {
  const { logs, olKey, taker } = params
  const olKeyHash = hash(olKey).toLowerCase()
  const result: Result = {
    takerGave: 0n,
    takerGot: 0n,
    feePaid: 0n,
    bounty: 0n,
  }

  let orderStarted = false

  const events = parseEventLogs({
    abi: mgvEventsABI,
    // optimise by not parsing all events (only mangrove events)
    logs: logs.filter((log) => isAddressEqual(log.address, params.mgv)),
    eventName: [
      'OrderStart',
      'OrderComplete',
      'OfferSuccess',
      'OfferFail',
      'OfferSuccessWithPosthookData',
      'OfferFailWithPosthookData',
    ],
  })

  for (const event of events) {
    // check if the event is related to the order
    if (
      !isAddressEqual(taker, params.taker) ||
      event.args.olKeyHash.toLowerCase() !== olKeyHash
    )
      continue

    // start the order
    if (!orderStarted && event.eventName === 'OrderStart') {
      orderStarted = true
      // continue to the next event
    } else if (!orderStarted) {
      // add the fee to the result
    } else if (event.eventName === 'OrderComplete') {
      result.feePaid = event.args.fee
      break
      // add the taker's give and get to the result on success
    } else if (
      event.eventName === 'OfferSuccess' ||
      event.eventName === 'OfferSuccessWithPosthookData'
    ) {
      result.takerGot += event.args.takerWants
      result.takerGave += event.args.takerGives
      // add the penalty to the result on failure
    } else if (
      event.eventName === 'OfferFail' ||
      event.eventName === 'OfferFailWithPosthookData'
    ) {
      result.bounty += event.args.penalty
    }
  }
  return result
}

export type MarketOrderResultFromLogsParams = {
  logs: Log[]
  bs: BS
  taker: Address
}

export function marketOrderResultFromLogs(
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  params: MarketOrderResultFromLogsParams,
): Result {
  const { mgv } = actionParams
  const { logs, bs, taker } = params
  const { base, quote, tickSpacing } = market
  const olKey: OLKey =
    bs === BS.buy
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
  return rawMarketOrderResultFromLogs({ logs, olKey, taker, mgv })
}
