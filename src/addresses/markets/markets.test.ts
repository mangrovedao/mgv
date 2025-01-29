import { describe, expect, expectTypeOf, it } from 'vitest'
import type { MarketParams } from '~mgv/types/index.js'

function testMarketFile(chain: string, module: any) {
  let keys = Object.keys(module)
  const marketListKey = `${chain}Markets`
  expect(keys).toContain(marketListKey)
  keys = keys.filter((key) => key !== marketListKey)

  // for each market, test name which should be `chainBaseQuote`
  // Test type of object

  for (const key of keys) {
    const market = module[key]
    const marketName = `${chain}${market.base.symbol.replace(
      /[^\w$]/g,
      '',
    )}${market.quote.symbol.replace(/[^\w$]/g, '')}`
    expect(key).toBe(marketName)
    expectTypeOf(module[key]).toMatchTypeOf<MarketParams>()
  }

  expect(module[marketListKey].length).toBe(keys.length)
}

describe('markets', () => {
  it('blast', async () => {
    const markets = await import('./blast.js')
    testMarketFile('blast', markets)
  })

  it('base-sepolia', async () => {
    const markets = await import('./base-sepolia.js')
    testMarketFile('baseSepolia', markets)
  })
})
