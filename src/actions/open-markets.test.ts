import { describe, expect, inject, it } from 'vitest'
import type { Token } from '~mgv/_types/index.js'
import { getClient } from '~test/src/client.js'
import { getOpenMarkets } from './open-markets.js'

const params = inject('mangrove')

describe('Getting the open markets', () => {
  it('should get the open markets', async () => {
    const client = getClient()
    const openMarkets = await getOpenMarkets(client, params)

    console.log(openMarkets.markets, 'markets')

    expect(openMarkets.markets[0]?.tkn0).toBeTypeOf('object')
    expect(openMarkets.markets[0]?.tkn1).toBeTypeOf('object')
    expect(openMarkets.markets[0]?.tickSpacing).toBeTypeOf('bigint')

    expect(openMarkets.markets[1]?.tkn0).toBeTypeOf('object')
    expect(openMarkets.markets[1]?.tkn1).toBeTypeOf('object')
    expect(openMarkets.markets[1]?.tickSpacing).toBeTypeOf('bigint')
  })

  it('should get the open markets config', async () => {
    const client = getClient()
    const openMarkets = await getOpenMarkets(client, params)
    console.log(openMarkets.marketsConfig, 'config')

    expect(openMarkets.marketsConfig).toBeTypeOf('object')
  })
})
