import type { MarketParams } from '../../types/index.js'
import {
  baseSepoliaDAI,
  baseSepoliaUSDC,
  baseSepoliaWBTC,
  baseSepoliaWETH,
} from '../tokens/base-sepolia.js'

export const baseSepoliaWETHUSDC = {
  base: baseSepoliaWETH,
  quote: baseSepoliaUSDC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseSepoliaWBTCDAI = {
  base: baseSepoliaWBTC,
  quote: baseSepoliaDAI,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseSepoliaMarkets = [
  baseSepoliaWETHUSDC,
  baseSepoliaWBTCDAI,
] as const satisfies MarketParams[]
