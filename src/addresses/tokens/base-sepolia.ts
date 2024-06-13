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

export const baseSepoliaWBTC = buildToken({
  address: '0x5146d560975A44B9Ad1a8bdF5f4017591a26df82',
  symbol: 'WBTC',
  decimals: 8,
  displayDecimals: 5,
  priceDisplayDecimals: 6,
  mgvTestToken: true,
})

export const baseSepoliaDAI = buildToken({
  address: '0x9508B3459Bc95A39CA66c385f1Ae12f03f72f8af',
  symbol: 'DAI',
  displayDecimals: 2,
  priceDisplayDecimals: 2,
  mgvTestToken: true,
})

export const baseSepoliaTokens = [
  baseSepoliaUSDC,
  baseSepoliaWETH,
  baseSepoliaWBTC,
  baseSepoliaDAI,
] as const
