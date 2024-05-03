import type { MarketParams } from '../../types/index.js'
import {
  blastMetaStreetWETHPUNKS20,
  blastMetaStreetWETHPUNKS40,
  blastUSDB,
  blastWETH,
} from '../tokens/blast.js'

export const blastMarkets = [
  {
    base: blastWETH,
    quote: blastUSDB,
    tickSpacing: 1n,
  },
  {
    base: blastMetaStreetWETHPUNKS20,
    quote: blastWETH,
    tickSpacing: 1n,
  },
  {
    base: blastMetaStreetWETHPUNKS40,
    quote: blastWETH,
    tickSpacing: 1n,
  },
] as const satisfies MarketParams[]
