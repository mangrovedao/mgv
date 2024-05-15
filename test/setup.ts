import { expect } from 'vitest'

expect.extend({
  toApproximateEqual: (
    received: bigint | number,
    expected: bigint | number,
    percentage = 0.001,
  ) => {
    // const diff = expected > received ? expected - received : received - expected
    // const maxDiff = BigInt(10) ** BigInt(decimalPrecision)
    // console.log({ diff, maxDiff })
    // console.log({ received, expected })
    const diff =
      Math.abs(Number(expected) - Number(received)) / Number(expected)
    const maxDiff = percentage
    return {
      pass: diff <= maxDiff,
      message: () =>
        `expected ${received} to be approximately equal to ${expected}`,
    }
  },
})
