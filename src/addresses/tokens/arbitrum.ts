import { buildToken } from './utils.js'

export const arbitrumWETH = buildToken({
  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  symbol: 'WETH',
})

export const arbitrumWBTC = buildToken({
  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  symbol: 'WBTC',
  decimals: 8,
  displayDecimals: 5,
  priceDisplayDecimals: 6,
})

export const arbitrumUSDC = buildToken({
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  symbol: 'USDC',
  decimals: 6,
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const arbitrumUSDT = buildToken({
  address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  symbol: 'USDT',
  decimals: 6,
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const arbitrumweETH = buildToken({
  address: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
  symbol: 'weETH',
})

export const arbitrumTokens = [
  arbitrumWETH,
  arbitrumWBTC,
  arbitrumUSDC,
  arbitrumUSDT,
  arbitrumweETH,
] as const
