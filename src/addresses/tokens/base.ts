import { buildToken } from './utils.js'

export const baseWETH = buildToken({
  address: '0x4200000000000000000000000000000000000006',
  symbol: 'WETH',
})

export const baseUSDC = buildToken({
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  symbol: 'USDC',
  displayDecimals: 2,
  priceDisplayDecimals: 4,
  decimals: 6,
})

export const baseCBETH = buildToken({
  address: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
  symbol: 'CBETH',
  decimals: 18,
  displayDecimals: 5,
  priceDisplayDecimals: 6,
})

export const baseWSTETH = buildToken({
  address: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
  symbol: 'WSTETH',
  decimals: 18,
  displayDecimals: 5,
  priceDisplayDecimals: 6,
})

export const baseCBBTC = buildToken({
  address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
  symbol: 'CBBTC',
  decimals: 8,
  displayDecimals: 5,
  priceDisplayDecimals: 6,
})

export const baseEURC = buildToken({
  address: '0x60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42',
  symbol: 'EURC',
  decimals: 6,
  displayDecimals: 2,
  priceDisplayDecimals: 4,
})

export const baseTokens = [
  baseWETH,
  baseUSDC,
  baseCBETH,
  baseWSTETH,
  baseCBBTC,
  baseEURC,
] as const
