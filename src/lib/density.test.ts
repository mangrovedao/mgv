import { describe, expect, it } from "vitest";
import { parseDensity, multiplyDensity } from "./density.js";

function rawDensityFromMantissa(_mantissa: bigint, _exponent: bigint) {
  const mantissa = _mantissa & 0b11n
  const exponent = _exponent & 0b1111111n
  const rawDensity = (exponent << 2n) | mantissa
  return rawDensity
}

function assertMultiply(mantissa: bigint, exponent: bigint, m: bigint, expected: bigint) {
  const rawDensity = rawDensityFromMantissa(mantissa, exponent)
  const density = parseDensity(rawDensity)
  const minimumVolume = multiplyDensity(density, m, false)
  expect(minimumVolume).toEqual(expected)
}

describe('density', () => {
  it('multiplication', () => {
    assertMultiply(0n, 0n, 0n, 0n)
    assertMultiply(0n, 0n, 1n, 0n)
    assertMultiply(1n, 0n, 1n, 0n)
    assertMultiply(2n, 0n, 2n, 0n)
    assertMultiply(3n, 0n, 2n ** 32n, 3n)
    assertMultiply(0n, 32n, 1n, 1n)
    assertMultiply(0n, 32n, 1n, 1n)
    assertMultiply(2n, 33n, 2n, 6n)
  })
})