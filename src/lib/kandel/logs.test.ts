import { isAddress } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { simulateSow } from '~mgv/actions/kandel/sow.js'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '~test/src/markets.js'
import { hash } from '../ol-key.js'
import { getKandelsFromLogs } from './logs.js'

const { smartKandelSeeder } = inject('kandel')
const { wethUSDC } = getMarkets()
const client = getClient()

describe('Kandel logs', () => {
  it('get smart kandel from logs', async () => {
    const { request } = await simulateSow(client, wethUSDC, smartKandelSeeder)
    const tx = await client.writeContract(request)
    const receipt = await client.waitForTransactionReceipt({
      hash: tx,
    })
    const result = getKandelsFromLogs(receipt.logs)
    expect(result.length).toEqual(1)
    expect(result[0].type).toEqual('SmartKandel')
    expect(result[0].owner).toAddressEqual(client.account.address)
    expect(result[0].baseQuoteOlKeyHash).toEqual(
      hash({
        outbound_tkn: wethUSDC.base.address,
        inbound_tkn: wethUSDC.quote.address,
        tickSpacing: wethUSDC.tickSpacing,
      }),
    )
    expect(isAddress(result[0].address))
  })
})
