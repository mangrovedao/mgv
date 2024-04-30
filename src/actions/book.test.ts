import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { getBook } from './book.js'

const { WETH, DAI } = inject('tokens')
const { mangrove, reader, order } = inject('mangrove')

describe('Getting the book', () => {
  it('should get the configs', async () => {
    const client = getClient()
    const book = await getBook(
      client,
      {
        mgv: mangrove,
        mgvReader: reader,
        mgvOrder: order,
      },
      {
        base: { address: WETH, decimals: 18 },
        quote: { address: DAI, decimals: 18 },
        tickSpacing: 1n,
      },
    )
    expect(book.marketConfig).toEqual({
      monitor: '0x0000000000000000000000000000000000000000',
      useOracle: false,
      notify: false,
      gasprice: 1680n,
      gasmax: 2000000n,
      dead: false,
      maxRecursionDepth: 75n,
      maxGasreqForFailingOffers: 6000000n,
    })

    expect(book.bidsConfig.active).toBeTruthy()
    expect(book.asksConfig.active).toBeTruthy()
  })
})
