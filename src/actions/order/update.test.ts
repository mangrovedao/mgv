import { parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { BS, Order } from '~mgv/lib/enums.js'
import {
  limitOrderResultFromLogs,
  setExpirationResultFromLogs,
  updateOrderResultFromLogs,
} from '~mgv/lib/limit-order.js'
import { tickFromVolumes } from '~mgv/lib/tick.js'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '~test/src/markets.js'
import { getBook } from '../book.js'
import { simulateLimitOrder } from './new.js'
import { simulateSetExpiration, simulateUpdateOrder } from './update.js'

const client = getClient()
const { wethUSDC } = getMarkets()
const params = inject('mangrove')

describe('update order', () => {
  it('updates an order', async () => {
    // create an order
    const book = await getBook(client, params, wethUSDC)

    let baseAmount = parseUnits('1', wethUSDC.base.decimals)
    let quoteAmount = parseUnits('3000', wethUSDC.quote.decimals)

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

    baseAmount *= 2n
    quoteAmount *= 3n

    const { request: updateRequest } = await simulateUpdateOrder(
      client,
      params,
      wethUSDC,
      {
        baseAmount,
        quoteAmount,
        restingOrderGasreq: 250_000n,
        bs: BS.buy,
        book,
        offerId: 1n,
      },
    )
    const updateTx = await client.writeContract(updateRequest)
    const updateReceipt = await client.waitForTransactionReceipt({
      hash: updateTx,
    })
    const updateResult = updateOrderResultFromLogs(params, wethUSDC, {
      logs: updateReceipt.logs,
      bs: BS.buy,
      offerId: 1n,
    })
    expect(updateResult.gives).toApproximateEqual(quoteAmount)
    expect(updateResult.wants).toApproximateEqual(baseAmount)
    expect(updateResult.tick).toBe(
      tickFromVolumes(baseAmount, quoteAmount, wethUSDC.tickSpacing),
    )
    expect(updateResult.gasreq).toBe(250_000n)
  })

  it('updates an order: expiry', async () => {
    // create an order
    const book = await getBook(client, params, wethUSDC)

    let baseAmount = parseUnits('1', wethUSDC.base.decimals)
    let quoteAmount = parseUnits('3000', wethUSDC.quote.decimals)

    let expiry = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24)

    const { request } = await simulateLimitOrder(client, params, wethUSDC, {
      baseAmount,
      quoteAmount,
      restingOrderGasreq: 250_000n,
      bs: BS.buy,
      book,
      orderType: Order.PO,
      expiryDate: expiry,
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
    expect(result.offer!.expiry).toBe(expiry)

    baseAmount *= 2n
    quoteAmount *= 3n

    expiry += 60n * 60n * 24n

    const { request: updateRequest } = await simulateSetExpiration(
      client,
      params,
      wethUSDC,
      {
        bs: BS.buy,
        offerId: 1n,
        expiryDate: expiry,
      },
    )
    const updateTx = await client.writeContract(updateRequest)
    const updateReceipt = await client.waitForTransactionReceipt({
      hash: updateTx,
    })
    const updateResult = setExpirationResultFromLogs(params, wethUSDC, {
      logs: updateReceipt.logs,
      bs: BS.buy,
      offerId: 1n,
    })

    expect(updateResult).toBe(expiry)
  })
})
