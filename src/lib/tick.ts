export const MAX_TICK = 887272n
export const MIN_TICK = -887272n

export const MAX_SAFE_VOLUME = 170141183460469231731687303715884105727n

/**
 * Checks if the volume is safe.
 * @param volume the volume of the asset
 * @returns true if the volume is safe, false otherwise
 */
export function isSafeVolume(volume: bigint): boolean {
  return volume >= 0n && volume <= MAX_SAFE_VOLUME
}

/**
 * Checks if a value is between MIN_TICK and MAX_TICK.
 * @param value The value of the tick
 * @returns true if the value is between MIN_TICK and MAX_TICK, false otherwise.
 * @example
 * const test = tickInRange(MAX_TICK);
 * console.log(test); // true
 *
 * const test = tickInRange(MIN_TICK - 1n);
 * console.log(test); // false
 */
export function tickInRange(tick: bigint): boolean {
  return tick >= MIN_TICK && tick <= MAX_TICK
}

/**
 * Computes the tick value corresponding to the price of the asset.
 * @param price the price of the asset
 * @param tickSpacing the tick spacing of the market @default 1n
 * @param roundUp round up the result @default false
 * @returns A Tick instance corresponding to the price of the asset.
 */
export function tickFromPrice(
  price: number,
  tickSpacing = 1n,
  roundUp = false,
): bigint {
  const roundMethod = roundUp ? Math.ceil : Math.floor
  const rawTick = BigInt(roundMethod(Math.log(price) / Math.log(1.0001)))
  const bin = rawTick / tickSpacing + (rawTick % tickSpacing > 0n ? 1n : 0n)
  return bin * tickSpacing
}

/**
 * Computes the tick value corresponding to the price between two assets.
 * @param inboundAmt amount of inbound asset
 * @param outboundAmt amount of outbound asset
 * @param tickSpacing the tick spacing of the market @default 1n
 * @returns A Tick instance corresponding to the price between the two assets.
 * @example
 * const inboundVolume = 100000000000000000000n
 * const outboundVolume = 100000000000000000000n
 *
 * const tick = tickFromVolumes(inboundVolume, outboundVolume)
 */
export function tickFromVolumes(
  inboundAmt: bigint,
  outboundAmt: bigint,
  tickSpacing = 1n,
): bigint {
  // This implementation is not exact
  const price = Number(inboundAmt) / Number(outboundAmt)
  return tickFromPrice(price, tickSpacing)
}

/**
 * Gets the price corresponding to the tick value.
 *
 * @remarks The price is a number and not a bigint.
 *
 * By using the floating point number type, we lose precision.
 *
 * This precision loss is acceptable because it is tested to be lower than 0.01%.
 *
 * @returns The price corresponding to the tick value.
 */
export function priceFromTick(tick: bigint): number {
  return 1.0001 ** Number(tick)
}

/**
 * Gets the amount of outbound asset from the amount of inbound asset
 *
 * Use this function over `outboundFromInboundUp`.
 *
 * @remarks We are rounding down the result.
 * @param tick the tick value
 * @param inboundAmt the amount of inbound asset
 * @param roundUp round up the result @default false
 * @returns the amount of outbound asset
 * @example
 * const inboundVolume = 100000000000000000000n
 * const tick = 100n
 * outboundFromInbound(tick, inboundVolume)
 */
export function outboundFromInbound(
  tick: bigint,
  inboundAmt: bigint,
  roundUp = false,
): bigint {
  const price = priceFromTick(tick)
  const roundMethod = roundUp ? Math.ceil : Math.floor
  const volume = BigInt(roundMethod(Number(inboundAmt) / price))
  return volume
}

/**
 * Gets the amount of inbound asset from the amount of outbound asset
 *
 * Use this function over `inboundFromOutbound`.
 *
 * @param tick the tick value
 * @param outboundAmt amount of outbound asset
 * @param roundUp round up the result @default true
 * @returns the amount of inbound asset
 * @example
 *
 * const outboundVolume = 100000000000000000000n
 * const tick = 100n
 * const inboundVolume = inboundFromOutbound(tick, outboundVolume)
 *
 */
export function inboundFromOutbound(
  tick: bigint,
  outboundAmt: bigint,
  roundup = true,
): bigint {
  const price = priceFromTick(tick)
  const roundMethod = roundup ? Math.ceil : Math.floor
  return BigInt(roundMethod(Number(outboundAmt) * price))
}
