import { describe, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { getOpenMarkets } from './open-markets.js'

const params = inject('mangrove')

describe('Getting the open markets', () => {
  it('should get the open markets', async () => {
    const client = getClient()
    const openMarkets = await getOpenMarkets(client, params)

    console.log(openMarkets.markets)

    // expect(openMarkets.markets).toEqual({
    //   monitor: '0x0000000000000000000000000000000000000000',
    //   useOracle: false,
    //   notify: false,
    //   gasprice: 1680n,
    //   gasmax: 2000000n,
    //   dead: false,
    //   maxRecursionDepth: 75n,
    //   maxGasreqForFailingOffers: 6000000n,
    // })

    // expect(book.bidsConfig.active).toBeTruthy()
    // expect(book.asksConfig.active).toBeTruthy()
  })

  it('should get the open markets config', async () => {
    const client = getClient()
    const openMarkets = await getOpenMarkets(client, params)
    console.log(openMarkets.marketsConfig)

    
    // expect(openMarkets.markets).toEqual({
        //   monitor: '0x0000000000000000000000000000000000000000',
    //   useOracle: false,
    //   notify: false,
    //   gasprice: 1680n,
    //   gasmax: 2000000n,
    //   dead: false,
    //   maxRecursionDepth: 75n,
    //   maxGasreqForFailingOffers: 6000000n,
    // })

    // expect(book.bidsConfig.active).toBeTruthy()
    // expect(book.asksConfig.active).toBeTruthy()
  })


})
