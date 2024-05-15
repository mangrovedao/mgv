import { erc20Abi } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { mint } from '~test/src/contracts/index.js'

const { WETH } = inject('tokens')
// const { mangrove, reader, order } = inject('mangrove')
const client = getClient()

describe('market-order', () => {
  it('should deal balance', async () => {
    await mint(client, WETH.address, client.account.address, 100n)
    const balance = await client.readContract({
      address: WETH.address,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [client.account.address],
    })
    expect(balance).toBe(100n)
  })
})
