import { isAddress } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { simulateSow } from './sow.js'

const { smartKandelSeeder } = inject('kandel')
const { wethUSDC } = inject('markets')
const client = getClient()

describe('sow', () => {
  it('sows', async () => {
    const { request, result } = await simulateSow(
      client,
      wethUSDC,
      smartKandelSeeder,
      {},
    )
    expect(isAddress(result)).toBe(true)
    const tx = await client.writeContract(request)
    const receipt = await client.waitForTransactionReceipt({ hash: tx })
    expect(receipt.status).toBe('success')
  })
})
