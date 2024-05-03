import { buildToken } from './utils.js'

export const blastWETH = buildToken({
  address: '0x4300000000000000000000000000000000000004',
  symbol: 'WETH',
})

export const blastUSDB = buildToken({
  address: '0x4300000000000000000000000000000000000002',
  symbol: 'USDB',
  displayDecimals: 2,
  priceDisplayDecimals: 2,
})

export const blastMetaStreetWETHPUNKS20 = buildToken({
  address: '0x9a50953716ba58e3d6719ea5c437452ac578705f',
  symbol: 'mwstETH-WPUNKS:20',
})

export const blastMetaStreetWETHPUNKS40 = buildToken({
  address: '0x999f220296b5843b2909cc5f8b4204aaca5341d8',
  symbol: 'mwstETH-WPUNKS:40',
})
