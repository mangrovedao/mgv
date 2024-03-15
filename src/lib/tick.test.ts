import { describe, expect, test } from 'vitest'
import {
  tickFromVolumes,
  outboundFromInbound,
  MAX_SAFE_VOLUME,
  inboundFromOutbound,
} from './tick.js'

function assertEq(a: bigint, b: bigint) {
  expect(a).toEqual(b)
}

function randBigInt(max: bigint) {
  // gen betwen 1 and max
  return BigInt(Math.floor(Math.random() * Number(max - 1n))) + 1n
}

function testPrice(inboundVolume: bigint, outboundVolume: bigint) {
  const tick = tickFromVolumes(inboundVolume, outboundVolume)
  const simulatedOutboundVolume = outboundFromInbound(tick, inboundVolume)
  const simulatedInboundVolume = inboundFromOutbound(tick, outboundVolume)
  const inboundDiffPercAbs = Math.abs(
    Number(inboundVolume - simulatedInboundVolume) / Number(inboundVolume),
  )
  const outboundDiffPercAbs = Math.abs(
    Number(outboundVolume - simulatedOutboundVolume) / Number(outboundVolume),
  )
  expect(inboundDiffPercAbs).toBeLessThanOrEqual(0.0001)
  expect(outboundDiffPercAbs).toBeLessThanOrEqual(0.0001)
}

describe('ticks', () => {
  test('tickFromVolume', () => {
    assertEq(tickFromVolumes(1n, 1n), 0n)
    assertEq(tickFromVolumes(2n, 1n), 6931n)
    assertEq(tickFromVolumes(1n, 2n), -6932n)
    assertEq(tickFromVolumes(10n ** 18n, 1n), 414486n)
    assertEq(tickFromVolumes(BigInt.asUintN(96, -1n), 1n), 665454n)
    assertEq(tickFromVolumes(1n, BigInt.asUintN(96, -1n)), -665455n)
    assertEq(tickFromVolumes(BigInt.asUintN(72, -1n), 1n), 499090n)
    assertEq(tickFromVolumes(1n, BigInt.asUintN(72, -1n)), -499091n)
    assertEq(tickFromVolumes(999999n, 1000000n), -1n)
    assertEq(tickFromVolumes(1000000n, 999999n), 0n)
    assertEq(tickFromVolumes(1000000n * 10n ** 18n, 999999n * 10n ** 18n), 0n)
  })

  test('outboundFromInbound and inboundFromOutbound', () => {
    testPrice(1n, 1n)
    testPrice(2n, 1n)
    testPrice(1n, 2n)
    testPrice(10n ** 18n, 1n)
    testPrice(BigInt.asUintN(96, -1n), 1n)
    testPrice(1n, BigInt.asUintN(96, -1n))
    testPrice(BigInt.asUintN(72, -1n), 1n)
    testPrice(1n, BigInt.asUintN(72, -1n))
    testPrice(999999n, 1000000n)
    testPrice(1000000n, 999999n)
    testPrice(1000000n * 10n ** 18n, 999999n * 10n ** 18n)

    // adding some invariant testing
    for (let i = 0; i < 100; i++) {
      const inboundVolume = randBigInt(MAX_SAFE_VOLUME)
      const outboundVolume = randBigInt(MAX_SAFE_VOLUME)
      testPrice(inboundVolume, outboundVolume)
    }
  })
})
