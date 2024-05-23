import {
  erc20Abi,
  isAddress,
  isAddressEqual,
  maxUint128,
  maxUint256,
  parseUnits,
  zeroAddress,
} from 'viem'
import { afterEach, describe, expect, inject, it } from 'vitest'
import { limitOrderResultFromLogs } from '~mgv/lib/limit-order.js'
import { tickFromVolumes } from '~mgv/lib/tick.js'
import { getClient } from '~test/src/client.js'
import { BS, Order } from '../../lib/enums.js'
import { getBook } from '../book.js'
import { getLimitOrderSteps, getUserRouter, simulateLimitOrder } from './new.js'

const params = inject('mangrove')
const { wethUSDC } = inject('markets')
const client = getClient()

describe('new order', () => {
  afterEach(async () => {
    await client.reset()
  })

  it('get user router', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })
    expect(isAddress(router)).toBeTruthy()
    expect(!isAddressEqual(router, zeroAddress)).toBeTruthy()
  })

  it('getting the steps: not done', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })
    const steps = await getLimitOrderSteps(client, wethUSDC, {
      user: client.account.address,
      userRouter: router,
      bs: BS.buy,
    })
    expect(steps.length).toBe(1)
    expect(steps[0]).toStrictEqual({
      type: 'erc20Approval',
      params: {
        amount: maxUint256,
        from: client.account.address,
        spender: router,
        token: wethUSDC.quote,
      },
      done: false,
    })
  })

  it('getting the steps: done', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })
    const tx = await client.writeContract({
      address: wethUSDC.quote.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [router, maxUint256],
    })
    await client.waitForTransactionReceipt({ hash: tx })
    const steps = await getLimitOrderSteps(client, wethUSDC, {
      user: client.account.address,
      userRouter: router,
      bs: BS.buy,
    })
    expect(steps.length).toBe(1)
    expect(steps[0]).toStrictEqual({
      type: 'erc20Approval',
      params: {
        amount: maxUint256,
        from: client.account.address,
        spender: router,
        token: wethUSDC.quote,
      },
      done: true,
    })
  })

  it('geeting the steps: done (minimum)', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })
    const tx = await client.writeContract({
      address: wethUSDC.quote.address,
      abi: erc20Abi,
      functionName: 'approve',
      args: [router, maxUint128],
    })
    await client.waitForTransactionReceipt({ hash: tx })
    const steps = await getLimitOrderSteps(client, wethUSDC, {
      user: client.account.address,
      userRouter: router,
      bs: BS.buy,
    })
    expect(steps.length).toBe(1)
    expect(steps[0]).toStrictEqual({
      type: 'erc20Approval',
      params: {
        amount: maxUint256,
        from: client.account.address,
        spender: router,
        token: wethUSDC.quote,
      },
      done: true,
    })
  })

  it('creating an order', async () => {
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
  })

  it('creating an order with expiry and logics', async () => {
    const book = await getBook(client, params, wethUSDC)

    const baseAmount = parseUnits('1', wethUSDC.base.decimals)
    const quoteAmount = parseUnits('3000', wethUSDC.quote.decimals)

    const expiryDate = BigInt(Math.floor(Date.now() / 1000) + 1000)

    const { request } = await simulateLimitOrder(client, params, wethUSDC, {
      baseAmount,
      quoteAmount,
      restingOrderGasreq: 250_000n,
      bs: BS.buy,
      book,
      orderType: Order.PO,
      // random addresses
      takerGivesLogic: params.mgv,
      takerWantsLogic: params.mgv,
      expiryDate,
    })
    const tx = await client.writeContract(request)
    const receipt = await client.waitForTransactionReceipt({ hash: tx })
    const result = limitOrderResultFromLogs(params, wethUSDC, {
      logs: receipt.logs,
      user: client.account.address,
      bs: BS.buy,
    })
    expect(result.takerGivesLogic).toAddressEqual(params.mgv)
    expect(result.takerWantsLogic).toAddressEqual(params.mgv)
    expect(result.offer).toBeDefined()
    expect(result.offer!.expiry).toBe(expiryDate)
  })
})
