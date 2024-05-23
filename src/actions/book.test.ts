import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { getBook } from './book.js'

const { wethDAI } = inject('markets')
const params = inject('mangrove')

describe('Getting the book', () => {
  it('should get the configs', async () => {
    const client = getClient()
    const book = await getBook(client, params, wethDAI)
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

  // it('real book', async () => {
  //   const client = createPublicClient({
  //     transport: http(),
  //     chain: blast
  //   })
  //   const book = await getBook(
  //     client,
  //     {
  //       mgv: "0xb1a49C54192Ea59B233200eA38aB56650Dfb448C",
  //       mgvOrder: "0x83251E7F36a51c5238C9aa0c6Bb7cc209b32d80e",
  //       mgvReader: "0x26fD9643Baf1f8A44b752B28f0D90AEBd04AB3F8",
  //     },
  //     {
  //       base: {
  //         address: "0x4300000000000000000000000000000000000004",
  //         decimals: 18,
  //       },
  //       quote: {
  //         address: "0x4300000000000000000000000000000000000003",
  //         decimals: 18,
  //       },
  //       tickSpacing: 1n,
  //     },
  //   )
  // })
})
