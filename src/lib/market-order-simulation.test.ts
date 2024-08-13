import { createClient, http, parseUnits } from 'viem'
import { arbitrum } from 'viem/chains'
import { describe, it } from 'vitest'
import { getBook } from '~mgv/actions/book.js'
import { arbitrumMangrove, arbitrumWETHUSDC } from '~mgv/addresses/index.js'
import { marketOrderSimulation } from './market-order-simulation.js'
import { BS } from './enums.js'

describe('Market order simulation', () => {
  it('should simulate', async () => {
    const client = createClient({ transport: http(), chain: arbitrum })
    const book = await getBook(client, arbitrumMangrove, arbitrumWETHUSDC)
    const simulation = marketOrderSimulation({
      book,
      bs: BS.sell,
      base: parseUnits('0.01', 18),
    })
    console.log(simulation)
  })
})
