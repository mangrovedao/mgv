import { erc20Abi, parseEther, parseUnits, type Client } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { minVolume, validateKandelParams } from '~mgv/index.js'
import { getClient } from '~test/src/client.js'
import { mintAndApprove } from '~test/src/contracts/index.js'
import { getBook } from '../book.js'
import { simulateBind, simulateDeployRouter } from '../smart-router.js'
import { simulatePopulate } from './populate.js'
import { simulateSow } from './sow.js'
import { simulateMarketOrderByVolumeAndMarket } from '../market-order.js'
import { BS } from '~mgv/lib/enums.js'

const { smartKandelSeeder, kandelSeeder } = inject('kandel')
const { wethUSDC } = inject('markets')
const actionParams = inject('mangrove')
const client = getClient()

describe('populate smart kandel', () => {
  it('populates', async () => {
    const { request: sowReq, result: kandel } = await simulateSow(
      client,
      wethUSDC,
      smartKandelSeeder,
      {
        account: client.account.address,
      },
    )
    const hash = await client.writeContract(sowReq)
    await client.waitForTransactionReceipt({ hash })

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
      value: minProvision,
    })
    const hash2 = await client.writeContract(request)
    await client.waitForTransactionReceipt({ hash: hash2 })
  })
})

describe('populate kandel', () => {
  it('populates', async () => {
    const { request: sowReq, result: kandel } = await simulateSow(
      client,
      wethUSDC,
      kandelSeeder,
      {
        account: client.account.address,
      },
    )
    const hash = await client.writeContract(sowReq)
    await client.waitForTransactionReceipt({ hash })

    const book = await getBook(client, actionParams, wethUSDC)

    const { params, isValid, minProvision } = validateKandelParams({
      minPrice: 2990,
      midPrice: 3000,
      maxPrice: 3010,
      pricePoints: 5n,
      market: wethUSDC,
      baseAmount: parseEther('10'),
      quoteAmount: parseUnits('30000', 6),
      stepSize: 1n,
      gasreq: 350_000n,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
      deposit: true,
    })

    expect(isValid).toBe(true)

    // mint tokens and give approval to kandel
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

    const { request } = await simulatePopulate(client, kandel, {
      ...params,
      account: client.account.address,
      value: minProvision,
    })
    const hash2 = await client.writeContract(request)
    await client.waitForTransactionReceipt({ hash: hash2 })

    const book2 = await getBook(client, actionParams, wethUSDC)
    // console.log(book2)

    await mintAndApprove(
      client,
      wethUSDC.base.address,
      client.account.address,
      parseEther('4.999'),
      actionParams.mgv,
    )
    const {
      request: marketOrderRequest,
      takerGave,
      bounty,
    } = await simulateMarketOrderByVolumeAndMarket(
      client,
      actionParams,
      wethUSDC,
      {
        bs: BS.sell,
        baseAmount: parseEther('4.999'),
        quoteAmount: parseUnits('13000', 6),
      },
    )

    expect(takerGave).toBe(parseEther('4.999'))
    expect(bounty).toBe(0n)

    const marketOrderTx = await client.writeContract(marketOrderRequest)
    await client.waitForTransactionReceipt({ hash: marketOrderTx })

    const book3 = await getBook(client, actionParams, wethUSDC)
    // console.log(book3)

    // console.log(minVolume(book3.asksConfig, 128_000n))
  })

  it('populates', async () => {
    const { request: sowReq, result: kandel } = await simulateSow(
      client,
      wethUSDC,
      kandelSeeder,
      {
        account: client.account.address,
      },
    )
    const hash = await client.writeContract(sowReq)
    await client.waitForTransactionReceipt({ hash })

    const book = await getBook(client, actionParams, wethUSDC)

    const { params, isValid, minProvision } = validateKandelParams({
      minPrice: 2990,
      midPrice: 3000,
      maxPrice: 3010,
      pricePoints: 5n,
      market: wethUSDC,
      baseAmount: parseEther('0.05'),
      quoteAmount: parseUnits('150', 6),
      stepSize: 1n,
      gasreq: 350_000n,
      factor: 3,
      asksLocalConfig: book.asksConfig,
      bidsLocalConfig: book.bidsConfig,
      marketConfig: book.marketConfig,
      deposit: true,
    })

    // expect(isValid).toBe(true)

    // mint tokens and give approval to kandel
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

    const { request } = await simulatePopulate(client, kandel, {
      ...params,
      account: client.account.address,
      value: minProvision,
    })
    const hash2 = await client.writeContract(request)
    await client.waitForTransactionReceipt({ hash: hash2 })

    const book2 = await getBook(client, actionParams, wethUSDC)

    await mintAndApprove(
      client,
      wethUSDC.base.address,
      client.account.address,
      parseEther('0.01'),
      actionParams.mgv,
    )
    const {
      request: marketOrderRequest,
      takerGave,
      bounty,
    } = await simulateMarketOrderByVolumeAndMarket(
      client,
      actionParams,
      wethUSDC,
      {
        bs: BS.sell,
        baseAmount: parseEther('0.01'),
        quoteAmount: parseUnits('1', 6),
      },
    )

    // expect(takerGave).toBe(parseEther('4.999'))
    // expect(bounty).toBe(0n)

    const marketOrderTx = await client.writeContract(marketOrderRequest)
    await client.waitForTransactionReceipt({ hash: marketOrderTx })

    const book3 = await getBook(client, actionParams, wethUSDC)

    // console.log(minVolume(book3.asksConfig, 128_000n))

    await mintAndApprove(
      client,
      wethUSDC.quote.address,
      client.account.address,
      parseUnits('30', 6),
      actionParams.mgv,
    )

    const {
      request: marketOrderRequest2,
      takerGave: takerGave2,
      bounty: bounty2,
    } = await simulateMarketOrderByVolumeAndMarket(
      client,
      actionParams,
      wethUSDC,
      {
        bs: BS.buy,
        baseAmount: parseEther('0.01'),
        quoteAmount: parseUnits('30', 6),
      },
    )

    const marketOrderTx2 = await client.writeContract(marketOrderRequest2)
    await client.waitForTransactionReceipt({ hash: marketOrderTx2 })

    const book4 = await getBook(client, actionParams, wethUSDC)
  })
})
