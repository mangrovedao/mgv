import type { MarketParams } from '../../types/index.js'
import {
  baseCBBTC,
  baseCBETH,
  baseEURC,
  baseUSDC,
  baseWETH,
  baseWSTETH,
} from '../tokens/base.js'

export const baseWETHUSDC = {
  base: baseWETH,
  quote: baseUSDC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseCBBTCUSDC = {
  base: baseCBBTC,
  quote: baseUSDC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseWBTCEURC = {
  base: baseCBBTC,
  quote: baseEURC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseCBETHEURC = {
  base: baseCBETH,
  quote: baseWETH,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseWSTETHWETH = {
  base: baseWSTETH,
  quote: baseWETH,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseMarkets = [
  baseWETHUSDC,
  baseCBBTCUSDC,
  baseWBTCEURC,
  baseCBETHEURC,
  baseWSTETHWETH,
] as const satisfies MarketParams[]
