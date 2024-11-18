import type { MarketParams } from '../../types/index.js'
import {
  arbitrumArb,
  arbitrumUSDC,
  arbitrumUSDCe,
  arbitrumUSDT,
  arbitrumWBTC,
  arbitrumWETH,
  arbitrumweETH,
} from '../tokens/arbitrum.js'

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

export const arbitrumWETHWBTC = {
  base: arbitrumWETH,
  quote: arbitrumWBTC,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumWBTCUSDT = {
  base: arbitrumWBTC,
  quote: arbitrumUSDT,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumWETHweETH = {
  base: arbitrumweETH,
  quote: arbitrumWETH,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumARBUSDCe = {
  base: arbitrumArb,
  quote: arbitrumUSDCe,
  tickSpacing: 1n,
} as const satisfies MarketParams

export const arbitrumMarkets = [
  arbitrumWETHUSDC,
  arbitrumWETHUSDT,
  arbitrumUSDCUSDT,
  arbitrumWETHWBTC,
  arbitrumWBTCUSDT,
  arbitrumWETHweETH,
  arbitrumARBUSDCe,
] as const satisfies MarketParams[]
