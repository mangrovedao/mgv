import type { MarketParams } from '../../types/index.js'
import { baseSepoliaUSDC, baseSepoliaWETH } from '../tokens/base-sepolia.js'

export const baseSepoliaMarkets = [
  {
    base: baseSepoliaWETH,
    quote: baseSepoliaUSDC,
    tickSpacing: 1n,
  },
] as const satisfies MarketParams[]
