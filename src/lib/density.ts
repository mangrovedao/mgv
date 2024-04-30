import type { LocalConfig } from '../types/lib.js'

export function parseDensity(rawDensity: bigint): number {
  // Extract the mantissa and exponent
  const mantissa = Number(rawDensity & 0b11n) // Last 2 bits
  const exponent = Number((rawDensity >> 2n) & 0b1111111n) // Next 7 bits

  // Convert based on the encoding rules
  let density: number
  if (exponent === 0 || exponent === 1) {
    // If exponent is 0 or 1, density calculation
    density = mantissa * 2 ** -32
  } else {
    // Otherwise, density calculation
    density = (1 + mantissa / 4) * 2 ** (exponent - 32)
  }

  return density
}

export function formatDensity(density: number): bigint {
  let exponent: number;
  let mantissa: number;

  if (density < 2 ** -31) {
    // Special case handling for very small densities
    exponent = 0;
    mantissa = density / 2 ** -32;
  } else {
    // Calculate exponent from density
    exponent = Math.floor(Math.log2(density / 1.25)) + 32;
    if (exponent < 2) {
      // If the exponent falls in the special range
      exponent = 0;
      mantissa = density / 2 ** -32;
    } else {
      // Otherwise, calculate mantissa normally
      mantissa = (density / 2 ** (exponent - 32)) - 1;
      mantissa *= 4; // Scale mantissa back to 2-bit representation
    }
  }

  // Convert exponent and mantissa to integers
  exponent = Math.max(0, Math.min(127, exponent)); // Clamp exponent to 7 bits
  mantissa = Math.round(Math.max(0, Math.min(3, mantissa))); // Clamp mantissa to 2 bits

  // Combine mantissa and exponent into the rawDensity format
  return BigInt((exponent << 2) | mantissa);
}

export function multiplyDensity(density: number, b: bigint, up = true): bigint {
  const roundMethod = up ? Math.ceil : Math.round
  return BigInt(roundMethod(Number(b) * density))
}

/**
 *
 * @param config the local configuration of the market.
 * @param gasreq the gas required for the offer to execute.
 * @returns the minimum volume required to execute the offer.
 */
export function minVolume(config: LocalConfig, gasreq: bigint): bigint {
  return multiplyDensity(config.density, gasreq + config.offer_gasbase)
}
