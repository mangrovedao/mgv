import { buildToken } from './utils.js'

export const arbitrumWETH = buildToken({
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  symbol: 'WETH',
})

export const arbitrumUSDC = buildToken({
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  symbol: 'USDC',
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const arbitrumUSDT = buildToken({
  address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  symbol: 'USDT',
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const arbitrumTokens = [
  arbitrumWETH,
  arbitrumUSDC,
  arbitrumUSDT,
] as const
