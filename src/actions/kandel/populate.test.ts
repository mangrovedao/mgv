import { parseEther, parseUnits } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { validateKandelParams } from '~mgv/index.js'
import { getClient } from '~test/src/client.js'
import { getBook } from '../book.js'
import { simulateBind, simulateDeployRouter } from '../smart-router.js'
import { simulatePopulate } from './populate.js'
import { simulateSow } from './sow.js'

const { smartKandelSeeder } = inject('kandel')
const { wethUSDC } = inject('markets')
const actionParams = inject('mangrove')
const client = getClient()

describe('populate', () => {
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
      quoteAmount: parseUnits('3000', 18),
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
