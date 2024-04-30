import { describe, expect, it } from 'vitest'
import { formatDensity, minVolume, multiplyDensity, parseDensity } from './density.js'
import { unpackLocalConfig } from './local.js'

function rawDensityFromMantissa(_mantissa: bigint, _exponent: bigint) {
  const mantissa = _mantissa & 0b11n
  const exponent = _exponent & 0b1111111n
  const rawDensity = (exponent << 2n) | mantissa
  return rawDensity
}

function assertMultiply(
  mantissa: bigint,
  exponent: bigint,
  m: bigint,
  expected: bigint,
) {
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

  it('minVolume', () => {
    const config1 =
      unpackLocalConfig(
        58489816523122975299890583775436959374501462812418328786302690401608597023955n,
      )
    expect(minVolume(config1, 100000n)).toEqual(112589990684262400000n)
    expect(minVolume(config1, 200000n)).toEqual(140737488355328000000n)
    const config2 =
      unpackLocalConfig(
        58469385844139963415119921773987489198728065881713101747402725518552690895875n,
      )
    expect(minVolume(config2, 100000n)).toEqual(34359738368000000n)
    expect(minVolume(config2, 200000n)).toEqual(42949672960000000n)
  })

  it('formatDensity', () => {
    const numbers = [0n, 1n, 320n, 400n, 500n];
    for (const number of numbers) {
      const density = parseDensity(number);
      const expected = formatDensity(density);
      const diff = expected > number ? expected - number : number - expected;
      expect(diff).toBeLessThanOrEqual(1n);
    }
  })
})
