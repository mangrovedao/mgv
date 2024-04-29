import { MAIN_PORT } from 'globalSetup.js'
import { http, createTestClient } from 'viem'
import { localhost } from 'viem/chains'

export const globalTestClient = createTestClient({
  chain: localhost,
  transport: http(`https://localhost:${MAIN_PORT}`),
  mode: 'anvil',
})
