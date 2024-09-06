import { describe, expect, it, inject, beforeAll } from 'vitest'
import { BS } from './enums.js'
import { marketOrderSimulation } from './market-order-simulation.js'
import type { Book } from '../types/index.js'
import { getClient } from '~test/src/client.js'
import { simulateSow } from '~mgv/actions/kandel/sow.js'
import { validateKandelParams } from '~mgv/index.js'
import { mintAndApprove } from '~test/src/contracts/index.js'
import { parseEther, parseUnits } from 'viem'
import { getBook } from '~mgv/actions/book.js'
import { simulatePopulate } from '~mgv/actions/kandel/populate.js'
import { inboundFromOutbound, outboundFromInbound } from './tick.js'

const client = getClient();
const actionParams = inject('mangrove')
const kandelSeeder = inject('kandel')
const { wethUSDC } = inject('markets')

const KANDEL_GASREQ = 128_000n

describe('marketOrderSimulation', () => {
  let book: Book

  beforeAll(async () => {
    // Get the book
    book = await getBook(client, actionParams, wethUSDC)
    
    const { params, minProvision } = validateKandelParams({
      minPrice: 2990,
      midPrice: 3000,
      maxPrice: 3010,
      pricePoints: 5n,
      market: wethUSDC,
      baseAmount: parseEther('10'),
      quoteAmount: parseUnits('30000', 6),
      stepSize: 1n,
      gasreq: KANDEL_GASREQ,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
      deposit: true,
    })

    const { request: sowReq, result: kandel } = await simulateSow(
      client,
      wethUSDC,
      kandelSeeder.kandelSeeder,
      {
        account: client.account.address,
      },
    )
    const sowTx = await client.writeContract(sowReq)
    await client.waitForTransactionReceipt({ hash: sowTx })

    await mintAndApprove(
      client,
      wethUSDC.base.address,
      client.account.address,
      params.baseAmount || 0n,
      kandel,
    )
    await mintAndApprove(
      client,
      wethUSDC.quote.address,
      client.account.address,
      params.quoteAmount || 0n,
      kandel,
    )

    const { request: populateReq } = await simulatePopulate(client, kandel, {
      ...params,
      account: client.account.address,
      value: minProvision,
    })
    const populateTx = await client.writeContract(populateReq)
    await client.waitForTransactionReceipt({ hash: populateTx })

    book = await getBook(client, actionParams, wethUSDC)
  })

  it('should simulate a buy market order', () => {
    const baseAmount = parseEther('4')
    const quoteAmount = inboundFromOutbound(book.asks[0]!.offer.tick, baseAmount)
    const fee = baseAmount * book.asksConfig.fee / 10_000n

    const result = marketOrderSimulation({
      book,
      bs: BS.buy,
      base: baseAmount, // 5 tokens
    })


    expect(result.baseAmount).toBe(baseAmount - fee)
    expect(result.quoteAmount).toBe(quoteAmount)
    expect(result.gas).toBe(KANDEL_GASREQ + book.asksConfig.offer_gasbase)
    expect(result.feePaid).toBe(fee)
    expect(result.maxTickEncountered).toBe(book.asks[0]?.offer.tick)
    expect(result.minSlippage).toBe(0)
    expect(result.fillWants).toBe(true)
    expect(result.rawPrice).approximately(3000/1e12, 10e-12)
    expect(result.fillVolume).toBe(baseAmount)
  })

  it('should simulate a sell market order', () => {
    const baseAmount = parseEther('4')
    const quoteAmount = outboundFromInbound(book.bids[0]!.offer.tick, baseAmount)
    const fee = quoteAmount * book.bidsConfig.fee / 10_000n

    const result = marketOrderSimulation({
      book,
      bs: BS.sell,
      base: baseAmount,
    })

    expect(result.baseAmount).toBe(baseAmount)
    expect(result.quoteAmount).toBe(quoteAmount - fee)
    expect(result.gas).toBe(KANDEL_GASREQ + book.bidsConfig.offer_gasbase)
    expect(result.feePaid).toBe(fee)
    expect(result.maxTickEncountered).toBe(book.bids[0]?.offer.tick)
    expect(result.minSlippage).toBe(0)
    expect(result.fillWants).toBe(false)
    expect(result.rawPrice).approximately(3000/1e12, 10e-12)
    expect(result.fillVolume).toBe(baseAmount)
  })

  it('should simulate a buy market order with quote amount', () => {
    const quoteAmount = parseUnits('12000', 6) // 12000 USDC
    const baseAmount = outboundFromInbound(book.asks[0]!.offer.tick, quoteAmount)
    const fee = baseAmount * book.asksConfig.fee / 10_000n
    
    const result = marketOrderSimulation({
      book,
      bs: BS.buy,
      quote: quoteAmount, // 12000 USDC
    })

    expect(result.baseAmount).toBe(baseAmount - fee)
    expect(result.quoteAmount).toBe(quoteAmount)
    expect(result.gas).toBe(KANDEL_GASREQ + book.asksConfig.offer_gasbase)
    expect(result.feePaid).toBe(fee)
    expect(result.maxTickEncountered).toBe(book.asks[0]!.offer.tick)
    expect(result.minSlippage).toBe(0)
    expect(result.fillWants).toBe(false)
    expect(result.rawPrice).approximately(3000/1e12, 10e-12)
    expect(result.fillVolume).toBe(quoteAmount)
  })

  it('should simulate a sell order with quote amount', () => {
    const quoteAmount = parseUnits('12000', 6) // 12000 USDC
    const baseAmount = inboundFromOutbound(book.bids[0]!.offer.tick, quoteAmount)
    const fee = quoteAmount * book.bidsConfig.fee / 10_000n

    const result = marketOrderSimulation({
      book,
      bs: BS.sell,
      quote: quoteAmount, // 12000 USDC
    })

    expect(result.baseAmount).toBe(baseAmount)
    expect(result.quoteAmount).toBe(quoteAmount - fee)
    expect(result.gas).toBe(KANDEL_GASREQ + book.bidsConfig.offer_gasbase)
    expect(result.feePaid).toBe(fee)
    expect(result.maxTickEncountered).toBe(book.bids[0]!.offer.tick)
    expect(result.minSlippage).toBe(0)
    expect(result.fillWants).toBe(true)
    expect(result.rawPrice).approximately(3000/1e12, 10e-12)
    expect(result.fillVolume).toBe(quoteAmount)
  })

  it('should throw an error if neither base nor quote is specified', () => {
    expect(() =>
      // @ts-expect-error
      marketOrderSimulation({
        book,
        bs: BS.buy,
      }),
    ).toThrow('either base or quote must be specified')
  })
})
