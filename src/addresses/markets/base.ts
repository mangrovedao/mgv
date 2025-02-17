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

export const baseCBBTCEURC = {
  base: baseCBBTC,
  quote: baseEURC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const baseCBETHWETH = {
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
  baseCBBTCEURC,
  baseCBETHWETH,
  baseWSTETHWETH,
] as const satisfies MarketParams[]
