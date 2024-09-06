import { type Address, parseEther, parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { validateKandelParams } from '~mgv/index.js'
import type { KandelParams, MarketParams } from '~mgv/index.js'
import { BS, Order } from '~mgv/lib/enums.js'
import { getClient } from '~test/src/client.js'
import { getMarkets } from '~test/src/markets.js'
import { getBook } from '../book.js'
import { simulateLimitOrder } from '../index.js'
import { simulateBind, simulateDeployRouter } from '../smart-router.js'
import { simulatePopulate } from './populate.js'
import { simulateSow } from './sow.js'
import { KandelStatus, getKandelState } from './view.js'

const { smartKandelSeeder } = inject('kandel')
const { wethUSDC } = getMarkets()
const actionParams = inject('mangrove')
const client = getClient()

async function sowAndPopulate(
  params: KandelParams,
  provision: bigint,
  market: MarketParams = wethUSDC,
): Promise<Address> {
  const { request: sowReq, result: kandel } = await simulateSow(
    client,
    market,
    smartKandelSeeder,
    {
      account: client.account.address,
    },
  )
  const hash = await client.writeContract(sowReq)
  await client.waitForTransactionReceipt({ hash })

  const { request: deployRouterReq, router } = await simulateDeployRouter(
    client,
    actionParams,
    {
      user: client.account.address,
    },
  )
  const routerTx = await client.writeContract(deployRouterReq)
  await client.waitForTransactionReceipt({ hash: routerTx })

  const { request: bindReq } = await simulateBind(client, router, {
    target: kandel,
  })
  const bindTx = await client.writeContract(bindReq)
  await client.waitForTransactionReceipt({ hash: bindTx })

  const { request } = await simulatePopulate(client, kandel, {
    ...params,
    account: client.account.address,
    value: provision,
  })
  const hash2 = await client.writeContract(request)
  await client.waitForTransactionReceipt({ hash: hash2 })

  return kandel
}

describe('view kandel', () => {
  it('view kandel state', async () => {
    const book = await getBook(client, actionParams, wethUSDC)

    const { params, isValid, minProvision } = validateKandelParams({
      minPrice: 2500,
      midPrice: 3000,
      maxPrice: 3500,
      pricePoints: 5n,
      market: wethUSDC,
      baseAmount: parseEther('1'),
      quoteAmount: parseUnits('3000', 6),
      stepSize: 1n,
      gasreq: 350_000n,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
    })

    expect(isValid).toBe(true)

    const kandel = await sowAndPopulate(params, minProvision * 3n)

    const kandelState = await getKandelState(
      client,
      actionParams,
      wethUSDC,
      kandel,
      {},
    )

    expect(kandelState.reversed).toBe(false)

    expect(kandelState.baseQuoteTickOffset).toBe(841n)
    expect(kandelState.baseAmount).toBe(parseEther('1'))
    expect(kandelState.quoteAmount).toBe(parseUnits('3000', 6))
    expect(kandelState.gasprice).toBe(0)
    expect(kandelState.gasreq).toBe(350_000)
    expect(kandelState.stepSize).toBe(1)
    expect(kandelState.pricePoints).toBe(5)
    expect(kandelState.asks.length).toBe(4)
    expect(kandelState.bids.length).toBe(4)
    expect(kandelState.unlockedProvision).toBe(minProvision * 2n)
    expect(kandelState.totalProvision).toBe(minProvision * 3n)
    expect(kandelState.kandelStatus).toBe(KandelStatus.Active)
  })

  it('creates a kandel out of range', async () => {
    const book = await getBook(client, actionParams, wethUSDC)

    const { params, isValid, minProvision } = validateKandelParams({
      minPrice: 2500,
      midPrice: 3500,
      maxPrice: 3500,
      pricePoints: 5n,
      market: wethUSDC,
      baseAmount: parseEther('1'),
      quoteAmount: parseUnits('3000', 6),
      stepSize: 1n,
      gasreq: 350_000n,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
    })

    expect(isValid).toBe(true) // even though out of range, params are valid

    const kandel = await sowAndPopulate(params, minProvision)

    // creating a limit order to shift price out of range

    const { request } = await simulateLimitOrder(
      client,
      actionParams,
      wethUSDC,
      {
        baseAmount: parseEther('1'),
        quoteAmount: parseUnits('4000', 6),
        restingOrderGasreq: 250_000n,
        bs: BS.sell,
        book,
        orderType: Order.PO,
      },
    )
    const tx = await client.writeContract(request)
    await client.waitForTransactionReceipt({ hash: tx })

    const kandelState = await getKandelState(
      client,
      actionParams,
      wethUSDC,
      kandel,
      {},
    )

    expect(kandelState.kandelStatus).toBe(KandelStatus.OutOfRange)
  })

  it('creates a reversed kandel', async () => {
    const reversedMarket: MarketParams = {
      base: wethUSDC.quote,
      quote: wethUSDC.base,
      tickSpacing: wethUSDC.tickSpacing,
    }

    const book = await getBook(client, actionParams, reversedMarket)

    const { params, isValid, minProvision } = validateKandelParams({
      minPrice: 1 / 3500,
      midPrice: 1 / 3000,
      maxPrice: 1 / 2500,
      pricePoints: 5n,
      market: reversedMarket,
      baseAmount: parseUnits('3000', 6),
      quoteAmount: parseEther('1'),
      stepSize: 1n,
      gasreq: 350_000n,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
    })

    const kandel = await sowAndPopulate(params, minProvision, reversedMarket)

    expect(isValid).toBe(true)

    const kandelState = await getKandelState(
      client,
      actionParams,
      wethUSDC,
      kandel,
      {},
    )

    expect(kandelState.reversed).toBe(true)

    expect(kandelState.baseQuoteTickOffset).toBe(841n)
    expect(kandelState.baseAmount).toBe(parseEther('1'))
    expect(kandelState.quoteAmount).toBe(parseUnits('3000', 6))
    expect(kandelState.gasprice).toBe(0)
    expect(kandelState.gasreq).toBe(350_000)
    expect(kandelState.stepSize).toBe(1)
    expect(kandelState.pricePoints).toBe(5)
    expect(kandelState.asks.length).toBe(4)
    expect(kandelState.bids.length).toBe(4)
    expect(kandelState.unlockedProvision).toBe(0n)
    expect(kandelState.kandelStatus).toBe(KandelStatus.Active)
  })
})
