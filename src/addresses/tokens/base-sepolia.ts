import { buildToken } from './utils.js'

export const baseSepoliaWETH = buildToken({
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
})

export const baseSepoliaUSDC = buildToken({
  address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  symbol: 'USDC',
  displayDecimals: 2,
  priceDisplayDecimals: 2,
  decimals: 6,
})

export const baseSepoliaTokens = [baseSepoliaUSDC, baseSepoliaWETH] as const
