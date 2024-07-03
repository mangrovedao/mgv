import type { MarketParams } from '../../types/index.js'
import {
  blastMetaStreetWETHPUNKS20,
  blastMetaStreetWETHPUNKS40,
  blastUSDB,
  blastUSDe,
  blastWETH,
  blastBLAST,
} from '../tokens/blast.js'

export const blastWETHUSDB = {
  base: blastWETH,
  quote: blastUSDB,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const blastUSDeUSDB = {
  base: blastUSDe,
  quote: blastUSDB,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const blastmwstETHWPUNKS20WETH = {
  base: blastMetaStreetWETHPUNKS20,
  quote: blastWETH,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const blastmwstETHWPUNKS40WETH = {
  base: blastMetaStreetWETHPUNKS40,
  quote: blastWETH,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const blastBLASTUSDB = {
  base: blastBLAST,
  quote: blastUSDB,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const blastBLASTWETH = {
  base: blastBLAST,
  quote: blastWETH,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const blastMarkets = [
  blastWETHUSDB,
  blastBLASTUSDB,
  blastUSDeUSDB,
  blastBLASTWETH,
  blastmwstETHWPUNKS20WETH,
  blastmwstETHWPUNKS40WETH,
] as const satisfies MarketParams[]
