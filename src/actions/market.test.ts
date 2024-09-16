import { describe, expect, inject, it } from 'vitest'
import { getMarkets } from '~mgv/actions/market.js'
import { getClient } from '~test/src/client.js'

const mgv = inject('mangrove')
const client = getClient()

describe('market', () => {
  it('should fetch all the markets', async () => {
    const markets = await getMarkets(client, mgv)
    expect(markets).toStrictEqual([
      {
        tkn0: {
          decimals: 18,
          symbol: 'WETH',
          token: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        },
        tkn1: {
          decimals: 6,
          symbol: 'USDC',
          token: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        },
        tickSpacing: 1n,
      },
      {
        tkn0: {
          decimals: 18,
          symbol: 'WETH',
          token: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        },
        tkn1: {
          decimals: 18,
          symbol: 'DAI',
          token: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        },
        tickSpacing: 1n,
      },
    ])
  })
})
