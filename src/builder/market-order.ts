import { type Address, type ContractFunctionParameters, parseAbi } from 'viem'
import { BS } from '../lib/enums.js'
import { tickFromPrice } from '../lib/tick.js'
import type { OLKey } from '../types/lib.js'
import { olKeyABIRaw } from './structs.js'

/**
 * Parameters for a market order by tick.
 * @param olKey the OLKey object
 * @param maxTick the maximum tick for the order
 * @param fillVolume the volume to fill
 * @param fillWants whether the fillVolume is the amount to give or to take
 */
export type MarketOrderByTickParams = {
  olKey: OLKey
  maxTick: bigint
  fillVolume: bigint
  fillWants: boolean
}

export const marketOrderByTickABI = parseAbi([
  olKeyABIRaw,
  'function marketOrderByTick(OLKey olKey, int maxTick, uint fillVolume, bool fillWants) public returns (uint takerGot, uint takerGave, uint bounty, uint feePaid)',
])

/**
 *
 * @param params market order params
 * @returns the parameters for a market order by tick for viem
 * @example
 *
 * ```ts
 * walletClient.writeContract({
 *   address: "0x...",
 *   ...marketOrderParams({
 *     ...
 *   })
 * });
 * ```
 *
 */
export function marketOrderByTickParams(params: MarketOrderByTickParams) {
  return {
    abi: marketOrderByTickABI,
    functionName: 'marketOrderByTick',
    args: [params.olKey, params.maxTick, params.fillVolume, params.fillWants],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof marketOrderByTickABI,
      'nonpayable',
      'marketOrderByTick'
    >,
    'address'
  >
}

/**
 * Parameters for a market order by volume.
 * @param olKey the OLKey object
 * @param wants the wants volume
 * @param gives the gives volume
 * @param fillWants Whether to fill the wants or the gives (it will stop when the volume is filled or the price is not good enough)
 */
export type MarketOrderByVolumeParams = {
  olKey: OLKey
  wants: bigint
  gives: bigint
  slippage?: number
  fillWants?: boolean
}

/**
 * @param params market order params
 * @param params market order params
 * @returns the parameters for a market order by volume for viem
 */
export function marketOrderByVolumeParams(params: MarketOrderByVolumeParams) {
  const { olKey, wants, gives, fillWants = false, slippage = 0 } = params

  const fillVolume = fillWants ? wants : gives
  const price = (Number(gives) * (1 + slippage)) / Number(wants)
  const maxTick = tickFromPrice(price)

  return marketOrderByTickParams({
    olKey,
    maxTick,
    fillVolume,
    fillWants,
  })
}

/**
 * Parameters for a market order by volume and market.
 * @param base the base token address
 * @param quote the quote token address
 * @param tickSpacing the tick spacing
 * @param baseAmount the base amount
 * @param quoteAmount the quote amount
 * @param bs the buy/sell enum
 * @param fillWants whether to fill the wants or the gives (it will stop when the volume is filled or the price is not good enough)
 * @param slippage the slippage
 */
export type MarketOrderByVolumeAndMarketParams = {
  base: Address
  quote: Address
  tickSpacing: bigint
  baseAmount: bigint
  quoteAmount: bigint
  bs: BS
  fillWants?: boolean
  slippage?: number
}

export function marketOrderByVolumeAndMarketParams(
  params: MarketOrderByVolumeAndMarketParams,
) {
  const {
    base,
    quote,
    tickSpacing,
    baseAmount,
    quoteAmount,
    bs,
    fillWants = bs === BS.buy,
    slippage,
  } = params

  const olKey: OLKey = {
    outbound_tkn: bs === BS.buy ? base : quote,
    inbound_tkn: bs === BS.buy ? quote : base,
    tickSpacing,
  }

  const wants = bs === BS.buy ? baseAmount : quoteAmount
  const gives = bs === BS.buy ? quoteAmount : baseAmount

  return marketOrderByVolumeParams({
    olKey,
    wants,
    gives,
    fillWants,
    slippage,
  })
}
