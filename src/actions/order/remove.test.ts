import { parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { BS, Order } from '~mgv/lib/enums.js'
import {
  limitOrderResultFromLogs,
  removeOrderResultFromLogs,
} from '~mgv/lib/limit-order.js'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '~test/src/markets.js'
import { getBook } from '../book.js'
import { simulateLimitOrder } from './new.js'
import { simulateRemoveOrder } from './remove.js'

const client = getClient()
const { wethUSDC } = getMarkets()
const params = inject('mangrove')

describe('remove order', () => {
  it('removes the order: no deprovisionning', async () => {
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

    const { request: removeRequest } = await simulateRemoveOrder(
      client,
      params,
      wethUSDC,
      {
        bs: BS.buy,
        offerId: 1n,
        deprovision: false,
      },
    )
    const removeTx = await client.writeContract(removeRequest)
    const removeReceipt = await client.waitForTransactionReceipt({
      hash: removeTx,
    })
    const removeResult = removeOrderResultFromLogs(params, wethUSDC, {
      logs: removeReceipt.logs,
      offerId: 1n,
      bs: BS.buy,
    })
    expect(removeResult.success).toBeTruthy()
    expect(removeResult.deprovision).toBeFalsy()
  })

  it('removes the order: deprovisionning', async () => {
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

    const { request: removeRequest } = await simulateRemoveOrder(
      client,
      params,
      wethUSDC,
      {
        bs: BS.buy,
        offerId: 1n,
        deprovision: true,
      },
    )
    const removeTx = await client.writeContract(removeRequest)
    const removeReceipt = await client.waitForTransactionReceipt({
      hash: removeTx,
    })
    const removeResult = removeOrderResultFromLogs(params, wethUSDC, {
      logs: removeReceipt.logs,
      offerId: 1n,
      bs: BS.buy,
    })
    expect(removeResult.success).toBeTruthy()
    expect(removeResult.deprovision).toBeTruthy()
  })
})
