import {
  http,
  createTestClient,
  defineChain,
  publicActions,
  walletActions,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import { ipc } from 'viem/node'
import { multicall } from '~test/globalSetup.js'
import { accounts, poolId } from './constants.js'

export const globalTestClient = createTestClient({
  chain: foundry,
  transport: ipc('/tmp/anvil.ipc'),
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

  const httpTransport = http(
    `http://localhost:${process.env.PROXY_PORT || 8545}/${poolId}`,
  )

  // const ipcTransport = ipc(`/tmp/anvil-${poolId}.ipc`)

  return createTestClient({
    chain: mgvTestChain,
    transport: httpTransport,
    mode: 'anvil',
    account: privateKeyToAccount(accounts[0].privateKey),
  })
    .extend(walletActions)
    .extend(publicActions)
}
