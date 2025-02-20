import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { getOpenMarkets } from './reader.js'

const client = getClient()
const params = inject('mangrove')
const { WETH, USDC, DAI } = inject('tokens')
const { wethDAI, wethUSDC } = inject('markets')

describe('getOpenMarkets', () => {
  it('should return the open markets', async () => {
    const markets = await getOpenMarkets(client, params, {
      cashnesses: {
        WETH: 1,
        USDC: 1000,
        DAI: 1000,
      },
    })

    expect(markets[0]?.base.address.toLowerCase()).toEqual(
      wethUSDC.base.address.toLowerCase(),
    )
    expect(markets[0]?.quote.address.toLowerCase()).toEqual(
      wethUSDC.quote.address.toLowerCase(),
    )
    expect(markets[1]?.base.address.toLowerCase()).toEqual(
      wethDAI.base.address.toLowerCase(),
    )
    expect(markets[1]?.quote.address.toLowerCase()).toEqual(
      wethDAI.quote.address.toLowerCase(),
    )

    expect(markets[0]?.base.symbol).toEqual(WETH.symbol)
    expect(markets[0]?.quote.symbol).toEqual(USDC.symbol)
    expect(markets[1]?.base.symbol).toEqual(WETH.symbol)
    expect(markets[1]?.quote.symbol).toEqual(DAI.symbol)

    expect(markets[0]?.base.decimals).toEqual(WETH.decimals)
    expect(markets[0]?.quote.decimals).toEqual(USDC.decimals)
    expect(markets[1]?.base.decimals).toEqual(WETH.decimals)
    expect(markets[1]?.quote.decimals).toEqual(DAI.decimals)
  })

  it('should return the open markets with inverted cashnesses', async () => {
    const markets = await getOpenMarkets(client, params, {
      cashnesses: {
        WETH: 100000,
        USDC: 1000,
        DAI: 1000,
      },
    })

    expect(markets[0]?.base.address.toLowerCase()).toEqual(
      wethUSDC.quote.address.toLowerCase(),
    )
    expect(markets[0]?.quote.address.toLowerCase()).toEqual(
      wethUSDC.base.address.toLowerCase(),
    )
    expect(markets[1]?.base.address.toLowerCase()).toEqual(
      wethDAI.quote.address.toLowerCase(),
    )
    expect(markets[1]?.quote.address.toLowerCase()).toEqual(
      wethDAI.base.address.toLowerCase(),
    )
  })

  it('should return the open markets with symbol overrides', async () => {
    const markets = await getOpenMarkets(client, params, {
      cashnesses: {
        WETH: 1,
        USDC: 1000,
      },
      symbolOverrides: {
        USDC: 'USDC0',
      },
    })  

    expect(markets[0]?.base.symbol).toEqual('WETH')
    expect(markets[0]?.quote.symbol).toEqual('USDC0')
  })
})
