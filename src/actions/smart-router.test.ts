import { isAddress } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { adminParams } from '../builder/smart-router.js'
import {
  getUserRouter,
  isBound,
  simulateBind,
  simulateDeployRouter,
} from './smart-router.js'

const client = getClient()
const params = inject('mangrove')

describe('smart router', () => {
  it('gets router address', async () => {
    const router = await getUserRouter(client, params, {
      user: client.account.address,
    })
    expect(isAddress(router)).toBeTruthy()
  })

  it('deploys router', async () => {
    const { router, created, request } = await simulateDeployRouter(
      client,
      params,
      {
        user: client.account.address,
      },
    )

    const routerExpected = await getUserRouter(client, params, {
      user: client.account.address,
    })

    expect(isAddress(router)).toBeTruthy()
    expect(created).toBeTruthy()
    expect(router).toAddressEqual(routerExpected)

    const tx = await client.writeContract(request)
    await client.waitForTransactionReceipt({
      hash: tx,
    })

    const admin = await client.readContract({
      address: router,
      ...adminParams,
    })

    expect(admin).toAddressEqual(client.account.address)
  })

  it('binds router', async () => {
    const { request, router } = await simulateDeployRouter(client, params, {
      user: client.account.address,
    })

    let tx = await client.writeContract(request)
    await client.waitForTransactionReceipt({
      hash: tx,
    })

    const isBoundToMangroveOrder = await isBound(client, router, {
      maker: params.mgvOrder,
    })

    expect(isBoundToMangroveOrder).toBeTruthy()

    const isBoundToMangrove = await isBound(client, router, {
      maker: params.mgv,
    })

    expect(isBoundToMangrove).toBeFalsy()

    const { request: request2 } = await simulateBind(client, router, {
      target: params.mgv,
    })
    tx = await client.writeContract(request2)
    await client.waitForTransactionReceipt({
      hash: tx,
    })

    const isBoundToMangroveAfter = await isBound(client, router, {
      maker: params.mgv,
    })
    expect(isBoundToMangroveAfter).toBeTruthy()
  })
})
