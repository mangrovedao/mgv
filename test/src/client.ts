import { http, createTestClient, publicActions, walletActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import { accounts } from './constants.js'

export const globalTestClient = createTestClient({
  chain: foundry,
  transport: http(`http://localhost:${process.env.MAIN_PORT || 8546}`),
  mode: 'anvil',
  account: privateKeyToAccount(accounts[0].privateKey),
})
  .extend(walletActions)
  .extend(publicActions)
