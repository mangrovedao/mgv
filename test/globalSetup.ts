import { createAnvil, startProxy } from '@viem/anvil'
import { type Address, parseEther, parseUnits } from 'viem'
import { foundry } from 'viem/chains'
import type { GlobalSetupContext } from 'vitest/node'
import { globalTestClient } from '~test/src/client.js'
import { accounts } from './src/constants.js'
import {
  deployERC20,
  deployMangroveCore,
  deployMangroveOrder,
  deployMangroveReader,
  deployRouterProxyFactory,
  openMarket,
  setMulticall,
} from './src/contracts/index.js'
import { getMangroveBytecodes } from './src/contracts/mangrove.js'

export const multicall: Address = '0xcA11bde05977b3631167028862bE2a173976CA11'

export default async function ({ provide }: GlobalSetupContext) {
  // create an anvil instance
  const anvil = createAnvil({
    port: Number(process.env.MAIN_PORT || 8546),
    chainId: foundry.id,
  })
  await anvil.start()

  // setting initial balances of accounts
  for (const account of accounts) {
    await Promise.all([
      globalTestClient.setBalance({
        address: account.address,
        value: account.balance,
      }),
    ])
  }

  // set multicall
  await setMulticall(multicall)

  // deploy erc20s and mint to accounts
  const WETH = await deployERC20('Wrapped Ether', 'WETH', 18)
  const USDC = await deployERC20('USD Coin', 'USDC', 6)
  const DAI = await deployERC20('Dai Stablecoin', 'DAI', 18)

  // deploy mangrove contracts
  const data = await getMangroveBytecodes()
  const mangrove = await deployMangroveCore(data.mangrove)
  const mangroveReader = await deployMangroveReader(
    mangrove,
    data.mangroveReader,
  )
  const routerProxyFactory = await deployRouterProxyFactory(
    data.routerProxyFactory,
  )
  const mangroveOrder = await deployMangroveOrder(
    mangrove,
    routerProxyFactory,
    data.mangroveOrder,
  )

  provide('tokens', { WETH, USDC, DAI })
  provide('mangrove', {
    mangrove,
    reader: mangroveReader,
    order: mangroveOrder,
    routerProxyFactory,
    multicall,
  })

  // open markets

  await openMarket(
    mangrove,
    mangroveReader,
    WETH,
    USDC,
    1n,
    5n,
    parseEther('0.00000001'),
    parseUnits('0.0001', 6),
  )

  await openMarket(
    mangrove,
    mangroveReader,
    WETH,
    DAI,
    1n,
    5n,
    parseEther('0.00000001'),
    parseEther('0.0001'),
  )

  // starts a proxy pool from there
  const shutdown = await startProxy({
    port: Number(process.env.PROXY_PORT || 8545),
    options: {
      forkUrl: `http://localhost:${process.env.MAIN_PORT || 8546}`,
    },
  })

  return async () => {
    await shutdown()
    await anvil.stop()
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    tokens: {
      WETH: Address
      USDC: Address
      DAI: Address
    }
    mangrove: {
      mangrove: Address
      reader: Address
      order: Address
      routerProxyFactory: Address
      multicall: Address
    }
  }
}
