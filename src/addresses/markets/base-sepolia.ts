import type { MarketParams } from '../../types/index.js'
import {
  baseSepoliaDAI,
  baseSepoliaUSDC,
  baseSepoliaWBTC,
  baseSepoliaWETH,
} from '../tokens/base-sepolia.js'

export const baseSepoliaMarkets = [
  {
    base: baseSepoliaWETH,
    quote: baseSepoliaUSDC,
    tickSpacing: 1n,
  },
  {
    base: baseSepoliaWBTC,
    quote: baseSepoliaDAI,
    tickSpacing: 1n,
  },
] as const satisfies MarketParams[]
