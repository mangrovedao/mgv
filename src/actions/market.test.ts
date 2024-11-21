import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '../actions/market.js'
import { blastUSDB } from '../addresses/index.js'

const mgv = inject('mangrove')
const client = getClient()

describe('market', () => {
  it('should fetch all the markets', async () => {
    const markets = await getMarkets(client, mgv, {
      USDC: { ...blastUSDB },
      WETH: { cashness: 50 },
      DAI: { cashness: 10000 },
    })
    expect(markets).toStrictEqual([
      {
        base: {
          decimals: 18,
          symbol: 'WETH',
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          displayDecimals: 3,
          mgvTestToken: false,
          priceDisplayDecimals: 4,
        },
        quote: {
          decimals: 6,
          symbol: 'USDC',
          address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
          displayDecimals: 2,
          mgvTestToken: false,
          priceDisplayDecimals: 4,
        },
        tickSpacing: 1n,
      },
      {
        base: {
          decimals: 18,
          symbol: 'WETH',
          address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
          displayDecimals: 3,
          mgvTestToken: false,
          priceDisplayDecimals: 4,
        },
        quote: {
          decimals: 18,
          symbol: 'DAI',
          address: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
          displayDecimals: 3,
          mgvTestToken: false,
          priceDisplayDecimals: 4,
        },
        tickSpacing: 1n,
      },
    ])
  })
})
