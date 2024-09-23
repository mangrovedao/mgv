import { parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { limitOrderResultFromLogs } from '~mgv/lib/limit-order.js'
import { tickFromVolumes } from '~mgv/lib/tick.js'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '~test/src/markets.js'
import { BA, BS, Order } from '../../lib/enums.js'
import { getBook } from '../book.js'
import { getUserRouter } from '../smart-router.js'
import { simulateLimitOrder } from './new.js'
import { getOrder, getOrders } from './view.js'

const client = getClient()
const params = inject('mangrove')
const { wethUSDC } = getMarkets()

describe('view order', () => {
  it('single order', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })

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
    expect(result.takerGave).toBe(0n)
    expect(result.takerGot).toBe(0n)
    expect(result.feePaid).toBe(0n)
    expect(result.bounty).toBe(0n)
    expect(result.takerGivesLogic).toBeUndefined()
    expect(result.takerWantsLogic).toBeUndefined()
    expect(result.offer).toBeDefined()
    expect(result.offer!.id).toBe(1n)
    expect(result.offer!.gives).toApproximateEqual(quoteAmount)
    expect(result.offer!.wants).toApproximateEqual(baseAmount)
    expect(result.offer!.tick).toBe(
      -tickFromVolumes(quoteAmount, baseAmount, wethUSDC.tickSpacing),
    )
    expect(result.offer!.gasprice).toBe(book.marketConfig.gasprice)
    expect(result.offer!.gasreq).toBe(250_000n)
    expect(result.offer!.expiry).toBeUndefined()

    const order = await getOrder(client, params, {
      offerId: 1n,
      market: wethUSDC,
      user: client.account.address,
      ba: BA.bids,
      userRouter: router,
    })

    expect(order.id).toBe(1n)

    expect(order.offer.gives).toBe(result.offer!.gives)
    expect(order.offer.tick).toBe(result.offer!.tick)

    expect(order.detail.gasreq).toBe(result.offer!.gasreq)
    expect(order.detail.gasprice).toBe(result.offer!.gasprice)
    expect(order.detail.kilo_offer_gasbase * 1_000n).toBe(
      book.bidsConfig.offer_gasbase,
    )
    expect(order.detail.maker).toAddressEqual(params.mgvOrder)

    expect(order.expiry).toBeUndefined()
    expect(order.baseLogic).toBeUndefined()
    expect(order.quoteLogic).toBeUndefined()
    expect(order.provision).toBe(
      (order.detail.gasreq + order.detail.kilo_offer_gasbase * 1_000n) *
        order.detail.gasprice *
        BigInt(1e6),
    )

    expect(order.isLive).toBe(true)
  })

  it('multiple orders', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })

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
    expect(result.takerGave).toBe(0n)
    expect(result.takerGot).toBe(0n)
    expect(result.feePaid).toBe(0n)
    expect(result.bounty).toBe(0n)
    expect(result.takerGivesLogic).toBeUndefined()
    expect(result.takerWantsLogic).toBeUndefined()
    expect(result.offer).toBeDefined()
    expect(result.offer!.id).toBe(1n)
    expect(result.offer!.gives).toApproximateEqual(quoteAmount)
    expect(result.offer!.wants).toApproximateEqual(baseAmount)
    expect(result.offer!.tick).toBe(
      -tickFromVolumes(quoteAmount, baseAmount, wethUSDC.tickSpacing),
    )
    expect(result.offer!.gasprice).toBe(book.marketConfig.gasprice)
    expect(result.offer!.gasreq).toBe(250_000n)
    expect(result.offer!.expiry).toBeUndefined()

    const orders = await getOrders(client, params, {
      user: client.account.address,
      userRouter: router,
      orders: [
        {
          market: wethUSDC,
          ba: BA.bids,
          offerId: 1n,
        },
        {
          market: wethUSDC,
          ba: BA.bids,
          offerId: 1n,
        },
        {
          market: wethUSDC,
          ba: BA.bids,
          offerId: 1n,
        },
      ],
    })

    expect(orders.length).toBe(3)

    expect(orders[0]!.id).toBe(1n)
    expect(orders[1]!.id).toBe(1n)
    expect(orders[2]!.id).toBe(1n)

    expect(orders[0]!.offer.gives).toBe(result.offer!.gives)
    expect(orders[1]!.offer.gives).toBe(result.offer!.gives)
    expect(orders[2]!.offer.gives).toBe(result.offer!.gives)
    expect(orders[0]!.offer.tick).toBe(result.offer!.tick)
    expect(orders[1]!.offer.tick).toBe(result.offer!.tick)
    expect(orders[2]!.offer.tick).toBe(result.offer!.tick)

    expect(orders[0]!.detail.gasreq).toBe(result.offer!.gasreq)
    expect(orders[1]!.detail.gasreq).toBe(result.offer!.gasreq)
    expect(orders[2]!.detail.gasreq).toBe(result.offer!.gasreq)
    expect(orders[0]!.detail.gasprice).toBe(result.offer!.gasprice)
    expect(orders[1]!.detail.gasprice).toBe(result.offer!.gasprice)
    expect(orders[2]!.detail.gasprice).toBe(result.offer!.gasprice)
    expect(orders[0]!.detail.kilo_offer_gasbase * 1_000n).toBe(
      book.bidsConfig.offer_gasbase,
    )
    expect(orders[1]!.detail.kilo_offer_gasbase * 1_000n).toBe(
      book.bidsConfig.offer_gasbase,
    )
    expect(orders[2]!.detail.kilo_offer_gasbase * 1_000n).toBe(
      book.bidsConfig.offer_gasbase,
    )
    expect(orders[0]!.detail.maker).toAddressEqual(params.mgvOrder)
    expect(orders[1]!.detail.maker).toAddressEqual(params.mgvOrder)
    expect(orders[2]!.detail.maker).toAddressEqual(params.mgvOrder)

    expect(orders[0]!.expiry).toBeUndefined()
    expect(orders[1]!.expiry).toBeUndefined()
    expect(orders[2]!.expiry).toBeUndefined()

    expect(orders[0]!.baseLogic).toBeUndefined()
    expect(orders[1]!.baseLogic).toBeUndefined()
    expect(orders[2]!.baseLogic).toBeUndefined()

    expect(orders[0]!.quoteLogic).toBeUndefined()
    expect(orders[1]!.quoteLogic).toBeUndefined()
    expect(orders[2]!.quoteLogic).toBeUndefined()
  })

  it('single order: with logic and expiry', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })

    const book = await getBook(client, params, wethUSDC)

    const baseAmount = parseUnits('1', wethUSDC.base.decimals)
    const quoteAmount = parseUnits('3000', wethUSDC.quote.decimals)

    const expiry = BigInt(Math.floor(Date.now() / 1000 + 60))

    const { request } = await simulateLimitOrder(client, params, wethUSDC, {
      baseAmount,
      quoteAmount,
      restingOrderGasreq: 250_000n,
      bs: BS.buy,
      book,
      orderType: Order.PO,
      takerGivesLogic: params.mgv,
      takerWantsLogic: params.mgv,
      expiryDate: expiry,
    })
    const tx = await client.writeContract(request)
    const receipt = await client.waitForTransactionReceipt({ hash: tx })
    const result = limitOrderResultFromLogs(params, wethUSDC, {
      logs: receipt.logs,
      user: client.account.address,
      bs: BS.buy,
    })

    expect(result.takerGivesLogic!).toAddressEqual(params.mgv)
    expect(result.takerWantsLogic!).toAddressEqual(params.mgv)

    const order = await getOrder(client, params, {
      user: client.account.address,
      market: wethUSDC,
      ba: BA.bids,
      offerId: 1n,
      userRouter: router,
    })

    expect(order.id).toBe(1n)
    expect(order.baseLogic).toBeDefined()
    expect(order.quoteLogic).toBeDefined()
    expect(order.expiry).toBeDefined()

    expect(order.baseLogic!).toAddressEqual(params.mgv)
    expect(order.quoteLogic!).toAddressEqual(params.mgv)
    expect(order.expiry).toBe(expiry)
  })

  it('multiple orders: with logic and expiry', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })

    const book = await getBook(client, params, wethUSDC)

    const baseAmount = parseUnits('1', wethUSDC.base.decimals)
    const quoteAmount = parseUnits('3000', wethUSDC.quote.decimals)

    const expiry = BigInt(Math.floor(Date.now() / 1000 + 60))

    const { request } = await simulateLimitOrder(client, params, wethUSDC, {
      baseAmount,
      quoteAmount,
      restingOrderGasreq: 250_000n,
      bs: BS.buy,
      book,
      orderType: Order.PO,
      takerGivesLogic: params.mgv,
      takerWantsLogic: params.mgv,
      expiryDate: expiry,
    })
    const tx = await client.writeContract(request)
    const receipt = await client.waitForTransactionReceipt({ hash: tx })
    const result = limitOrderResultFromLogs(params, wethUSDC, {
      logs: receipt.logs,
      user: client.account.address,
      bs: BS.buy,
    })

    expect(result.takerGivesLogic!).toAddressEqual(params.mgv)
    expect(result.takerWantsLogic!).toAddressEqual(params.mgv)

    const orders = await getOrders(client, params, {
      user: client.account.address,
      userRouter: router,
      orders: [
        {
          market: wethUSDC,
          ba: BA.bids,
          offerId: 1n,
        },
        {
          market: wethUSDC,
          ba: BA.bids,
          offerId: 1n,
        },
        {
          market: wethUSDC,
          ba: BA.bids,
          offerId: 1n,
        },
      ],
    })

    expect(orders.length).toBe(3)

    for (const order of orders) {
      expect(order.id).toBe(1n)
      expect(order.baseLogic).toBeDefined()
      expect(order.quoteLogic).toBeDefined()
      expect(order.expiry).toBeDefined()

      expect(order.baseLogic!).toAddressEqual(params.mgv)
      expect(order.quoteLogic!).toAddressEqual(params.mgv)
      expect(order.expiry).toBe(expiry)
    }
  })
})
