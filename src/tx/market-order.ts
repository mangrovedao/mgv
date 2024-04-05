import { parseAbi, type ContractFunctionParameters } from "viem";
import type { OLKey } from "../types/lib.js";
import { tickFromVolumes } from "../lib/tick.js";
import { olKeyABIRaw } from "./structs.js";

/**
 * Parameters for a market order by tick.
 * @param olKey the OLKey object
 * @param maxTick the maximum tick for the order
 * @param fillVolume the volume to fill
 * @param fillWants whether the fillVolume is the amount to give or to take
 */
export type MarketOrderByTickParams = {
  olKey: OLKey;
  maxTick: bigint;
  fillVolume: bigint;
  fillWants: boolean;
};

export const marketOrderByTickABI = parseAbi([
  olKeyABIRaw,
  "function marketOrderByTick(OLKey olKey, int maxTick, uint fillVolume, bool fillWants) public returns (uint takerGot, uint takerGave, uint bounty, uint feePaid)",
]);

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
    functionName: "marketOrderByTick",
    args: [params.olKey, params.maxTick, params.fillVolume, params.fillWants],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof marketOrderByTickABI,
      "nonpayable",
      "marketOrderByTick"
    >,
    "address"
  >;
}

/**
 * Parameters for a market order by volume.
 * @param olKey the OLKey object
 * @param wants the wants volume
 * @param gives the gives volume
 * @param fillWants Whether to fill the wants or the gives (it will stop when the volume is filled or the price is not good enough)
 */
export type MarketOrderByVolumeParams = {
  olKey: OLKey;
  wants: bigint;
  gives: bigint;
  fillWants: boolean;
};

/**
 * @param params market order params
 * @param params market order params
 * @returns the parameters for a market order by volume for viem
 */
export function marketOrderByVolumeParams({
  olKey,
  wants,
  gives,
  fillWants,
}: MarketOrderByVolumeParams) {
  const fillVolume = fillWants ? wants : gives;
  const tick = tickFromVolumes(gives, wants);

  return marketOrderByTickParams({
    olKey,
    maxTick: tick,
    fillVolume,
    fillWants,
  });
}

/**
 * Parameters for a market order by price.
 * @param olKey the OLKey object
 * @param price the price of the asset
 * @param fillWants whether the fillVolume is the amount to give or to take
 * @param fillVolume the volume to fill
 */
type MarketOrderWithPriceParams = {
  olKey: OLKey;
  gives: bigint;
  price: number;
  fillWants: boolean;
};

/**
 * @param params market order params
 * @returns the parameters for a market order by price for viem
 */
export function marketOrderWithPriceParams({
  olKey,
  gives,
  price,
  fillWants,
}: MarketOrderWithPriceParams) {
  const wants = BigInt(Math.floor(Number(gives) / price));
  return marketOrderByVolumeParams({ olKey, gives, wants, fillWants });
}
