import { erc20Abi, maxUint256, parseEther, parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { validateKandelParams } from '~mgv/index.js'
import { getClient } from '~test/src/client.js'
import { mintAndApprove } from '~test/src/contracts/index.js'
import { getBook } from '../book.js'
import { simulateBind, simulateDeployRouter } from '../smart-router.js'
import { simulatePopulate } from './populate.js'
import { simulateRetract } from './retract.js'
import { simulateSow } from './sow.js'

const { smartKandelSeeder, kandelSeeder } = inject('kandel')
const { wethUSDC } = inject('markets')
const actionParams = inject('mangrove')
const client = getClient()

describe('retract smart kandel', () => {
  it('retracts', async () => {
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

describe('retract kandel', () => {
  it('retracts', async () => {
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

    const { request: retractRequest } = await simulateRetract(client, kandel, {
      toIndex: 5n,
      recipient: client.account.address,
      baseAmount: maxUint256,
      quoteAmount: maxUint256,
      freeWei: maxUint256,
    })

    const hash3 = await client.writeContract(retractRequest)
    await client.waitForTransactionReceipt({ hash: hash3 })

    const balances = await client.multicall({
      contracts: [
        {
          address: wethUSDC.base.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [client.account.address],
        },
        {
          address: wethUSDC.quote.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [client.account.address],
        },
        {
          address: wethUSDC.base.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [kandel],
        },
        {
          address: wethUSDC.quote.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [kandel],
        },
        {
          address: actionParams.mgv,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [kandel],
        },
      ],
      allowFailure: false,
    })

    expect(balances[0]).toEqual(params.baseAmount)
    expect(balances[1]).toEqual(params.quoteAmount)

    expect(balances[2]).toEqual(0n)
    expect(balances[3]).toEqual(0n)
    expect(balances[4]).toEqual(0n)
  })
})
