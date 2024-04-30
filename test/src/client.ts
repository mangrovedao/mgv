import {
  http,
  createTestClient,
  defineChain,
  publicActions,
  walletActions,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import { multicall } from '~test/globalSetup.js'
import { accounts, poolId } from './constants.js'

export const globalTestClient = createTestClient({
  chain: foundry,
  transport: http(`http://localhost:${process.env.MAIN_PORT || 8546}`),
  mode: 'anvil',
  account: privateKeyToAccount(accounts[0].privateKey),
})
  .extend(walletActions)
  .extend(publicActions)

export function getClient() {
  const mgvTestChain = /*#__PURE__*/ defineChain({
    id: 31_337,
    name: 'Foundry',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: [`http://127.0.0.1:${process.env.PROXY_PORT || 8545}/${poolId}`],
        webSocket: [
          `ws://127.0.0.1:${process.env.PROXY_PORT || 8545}/${poolId}`,
        ],
      },
    },
    contracts: {
      multicall3: {
        address: multicall,
      },
    },
  })

  return createTestClient({
    chain: mgvTestChain,
    transport: http(
      `http://localhost:${process.env.PROXY_PORT || 8545}/${poolId}`,
    ),
    mode: 'anvil',
  })
    .extend(walletActions)
    .extend(publicActions)
}
