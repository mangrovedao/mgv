import { buildToken } from './utils.js'

export const blastWETH = buildToken({
  address: '0x4300000000000000000000000000000000000004',
  symbol: 'WETH',
})

export const blastUSDB = buildToken({
  address: '0x4300000000000000000000000000000000000003',
  symbol: 'USDB',
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const blastUSDe = buildToken({
  address: '0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34',
  symbol: 'USDe',
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const blastMetaStreetWETHPUNKS20 = buildToken({
  address: '0x9a50953716ba58e3d6719ea5c437452ac578705f',
  symbol: 'mwstETH-WPUNKS:20',
})

export const blastMetaStreetWETHPUNKS40 = buildToken({
  address: '0x999f220296b5843b2909cc5f8b4204aaca5341d8',
  symbol: 'mwstETH-WPUNKS:40',
})

export const blastTokens = [
  blastWETH,
  blastUSDB,
  blastUSDe,
  blastMetaStreetWETHPUNKS20,
  blastMetaStreetWETHPUNKS40,
] as const
