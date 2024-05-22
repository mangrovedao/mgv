import { parseAbi } from 'viem'
import { expect, it } from 'vitest'
import { describe, inject } from 'vitest'
import { getClient } from '~test/src/client.js'
import { createGeometricDistribution } from './distribution.js'
import { getKandelPositionRawParams } from './params.js'

const { kandelLib, smartKandelSeeder } = inject('kandel')
const { routerProxyFactory, mangrove } = inject('mangrove')
const { wethUSDC } = inject('markets')

const client = getClient()

const kandelLibAbi = parseAbi([
  'struct DistributionOffer {uint index;int tick;uint gives;}',
  'struct Distribution {DistributionOffer[] asks;DistributionOffer[] bids;}',
  'function createGeometricDistribution(uint from,uint to,int baseQuoteTickIndex0,uint _baseQuoteTickOffset,uint firstAskIndex,uint bidGives,uint askGives,uint pricePoints,uint stepSize) external pure returns (Distribution memory distribution)',
])

describe('distribution', () => {
  it('checks kandel deployment', async () => {
    const [factory, mgv] = await client.multicall({
      contracts: [
        {
          address: smartKandelSeeder,
          abi: parseAbi(['function PROXY_FACTORY() view returns (address)']),
          functionName: 'PROXY_FACTORY',
        },
        {
          address: smartKandelSeeder,
          abi: parseAbi(['function MGV() view returns (address)']),
          functionName: 'MGV',
        },
      ],
    })
    expect(factory.status).toEqual('success')
    expect(factory.result).toAddressEqual(routerProxyFactory)
    expect(mgv.status).toEqual('success')
    expect(mgv.result).toAddressEqual(mangrove)
  })

  it('checks kandel distribution', async () => {
    const params = getKandelPositionRawParams({
      minPrice: 2500,
      midPrice: 3000,
      maxPrice: 3500,
      pricePoints: 10n,
      market: wethUSDC,
    })

    const distrib = createGeometricDistribution({
      ...params,
      stepSize: 1n,
      market: wethUSDC,
      bidGives: 1n,
      askGives: 1n,
    })

    const fromChain = await client.readContract({
      address: kandelLib,
      abi: kandelLibAbi,
      functionName: 'createGeometricDistribution',
      args: [
        0n,
        10n,
        params.baseQuoteTickIndex0,
        params.baseQuoteTickOffset,
        params.firstAskIndex,
        1n,
        1n,
        params.pricePoints,
        1n,
      ],
    })

    expect(distrib.asks.length).toEqual(fromChain.asks.length)
    expect(distrib.bids.length).toEqual(fromChain.bids.length)

    for (let i = 0; i < distrib.asks.length; i++) {
      expect(distrib.asks[i].gives).toEqual(fromChain.asks[i].gives)
      expect(distrib.asks[i].tick).toEqual(fromChain.asks[i].tick)
      expect(distrib.asks[i].index).toEqual(fromChain.asks[i].index)
    }
    for (let i = 0; i < distrib.bids.length; i++) {
      expect(distrib.bids[i].gives).toEqual(fromChain.bids[i].gives)
      expect(distrib.bids[i].tick).toEqual(fromChain.bids[i].tick)
      expect(distrib.bids[i].index).toEqual(fromChain.bids[i].index)
    }
  })
})
