import { parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { BS, Order } from '~mgv/lib/enums.js'
import { limitOrderResultFromLogs } from '~mgv/lib/limit-order.js'
import { tickFromVolumes } from '~mgv/lib/tick.js'
import { getClient } from '~test/src/client.js'
import { getBook } from '../book.js'
import { simulateLimitOrder } from './new.js'

const client = getClient()
const { wethUSDC } = inject('markets')
const params = inject('mangrove')

describe('update order', () => {
  it('updates an order', async () => {
    // create an order
    const book = await getBook(client, params, wethUSDC)

    const baseAmount = parseUnits('1', wethUSDC.base.decimals)
    const quoteAmount = parseUnits('3000', wethUSDC.quote.decimals)

    const { request } = await simulateLimitOrder(client, params, wethUSDC, {
      baseAmount,
      quoteAmount,
      restingOrderGasreq: 250_000n,
      bs: BS.buy,
      book,
      orderType: Order.PO,
    })
    const tx = await client.writeContract(request)
    const receipt = await client.waitForTransactionReceipt({ hash: tx })
    const result = limitOrderResultFromLogs(params, wethUSDC, {
      logs: receipt.logs,
      user: client.account.address,
      bs: BS.buy,
    })
    expect(result.offer).toBeDefined()
    expect(result.offer!.id).toBe(1n)
    expect(result.offer!.gives).toApproximateEqual(quoteAmount)
    expect(result.offer!.wants).toApproximateEqual(baseAmount)
    expect(result.offer!.tick).toBe(
      -tickFromVolumes(quoteAmount, baseAmount, wethUSDC.tickSpacing),
    )
  })
})
