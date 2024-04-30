import { http, createTestClient, walletActions, publicActions } from 'viem'
import { foundry } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { accounts } from './constants.js'

export const globalTestClient = createTestClient({
  chain: foundry,
  transport: http(`http://localhost:${process.env.MAIN_PORT || 8546}`),
  mode: 'anvil',
  account: privateKeyToAccount(accounts[0].privateKey)
}).extend(walletActions).extend(publicActions)