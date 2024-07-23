import type { MarketParams } from '../../types/index.js'
import { arbitrumUSDC, arbitrumUSDT, arbitrumWETH } from '../tokens/arbitrum.js'

export const arbitrumWETHUSDC = {
  base: arbitrumWETH,
  quote: arbitrumUSDC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumWETHUSDT = {
  base: arbitrumWETH,
  quote: arbitrumUSDT,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumUSDCUSDT = {
  base: arbitrumUSDC,
  quote: arbitrumUSDT,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumMarkets = [
  arbitrumWETHUSDC,
  arbitrumWETHUSDT,
  arbitrumUSDCUSDT,
] as const satisfies MarketParams[]
