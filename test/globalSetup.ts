import { createAnvil, startProxy } from '@viem/anvil'
import { type Address, parseAbi, parseEther, parseUnits } from 'viem'
import { foundry } from 'viem/chains'
import type { GlobalSetupContext } from 'vitest/node'
import type { SerializableMarketParams, Token } from '~mgv/index.js'
import { toSerializable } from '~mgv/lib/utils.js'
import { globalTestClient } from '~test/src/client.js'
import { accounts } from './src/constants.js'
import {
  deployERC20,
  deployKandelSeeder,
  deployMangroveCore,
  deployMangroveOrder,
  deployMangroveReader,
  deployRouterProxyFactory,
  deploySmartKandel,
  openMarket,
  setMulticall,
} from './src/contracts/index.js'
import { kandelSeederBytecode } from './src/contracts/kandel-seeder.bytecode.js'
import { kandellibBytecode } from './src/contracts/kandellib.bytecode.js'
import { getMangroveBytecodes } from './src/contracts/mangrove.js'
import { smartKandelSeederBytecode } from './src/contracts/smart-kandel-seeder.bytecode.js'

export const multicall: Address = '0xcA11bde05977b3631167028862bE2a173976CA11'

export default async function ({ provide }: GlobalSetupContext) {
  // create an anvil instance
  const anvil = createAnvil({
    port: Number(process.env.MAIN_PORT || 8546),
    chainId: foundry.id,
    ipc: '/tmp/anvil.ipc',
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

  const routerImplementation = await globalTestClient.readContract({
    address: mangroveOrder,
    abi: parseAbi(['function ROUTER_IMPLEMENTATION() view returns (address)']),
    functionName: 'ROUTER_IMPLEMENTATION',
  })

  const { kandelLib, smartKandelSeeder } = await deploySmartKandel(
    mangrove,
    250_000n,
    routerProxyFactory,
    routerImplementation,
    kandellibBytecode,
    smartKandelSeederBytecode,
  )

  const kandelSeeder = await deployKandelSeeder(
    mangrove,
    128_000n,
    kandelLib,
    kandelSeederBytecode,
  )

  provide('tokens', { WETH, USDC, DAI })
  provide('mangrove', {
    mgv: mangrove,
    mgvReader: mangroveReader,
    mgvOrder: mangroveOrder,
    smartRouter: routerImplementation,
    routerProxyFactory,
    multicall,
  })
  provide('kandel', { kandelLib, kandelSeeder, smartKandelSeeder })

  // open markets

  const wethUSDC = await openMarket(
    mangrove,
    mangroveReader,
    WETH,
    USDC,
    1n,
    5n,
    parseEther('0.00000001'),
    parseUnits('0.0001', 6),
  )

  const wethDAI = await openMarket(
    mangrove,
    mangroveReader,
    WETH,
    DAI,
    1n,
    5n,
    parseEther('0.00000001'),
    parseEther('0.0001'),
  )

  provide('markets', {
    wethUSDC: toSerializable(wethUSDC),
    wethDAI: toSerializable(wethDAI),
  })

  // starts a proxy pool from there
  const shutdown = await startProxy({
    port: Number(process.env.PROXY_PORT || 8545),
    options: {
      forkUrl: '/tmp/anvil.ipc',
    },
  })

  return async () => {
    await shutdown()
    await anvil.stop()
  }
}

interface CustomMatchers<R = unknown> {
  toApproximateEqual: (
    expected: number | bigint,
    percentage?: number | undefined,
  ) => R
  toAddressEqual: (expected: Address) => R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
  export interface ProvidedContext {
    tokens: {
      WETH: Token
      USDC: Token
      DAI: Token
    }
    mangrove: {
      mgv: Address
      mgvReader: Address
      mgvOrder: Address
      smartRouter: Address
      routerProxyFactory: Address
      multicall: Address
    }
    markets: {
      wethUSDC: SerializableMarketParams
      wethDAI: SerializableMarketParams
    }
    kandel: {
      kandelLib: Address
      kandelSeeder: Address
      smartKandelSeeder: Address
    }
  }
}
