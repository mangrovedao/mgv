import { inject } from 'vitest'
import { fromSerializable } from '~mgv/lib/utils.js'

export function getMarkets() {
  const markets = inject('markets')
  return {
    wethUSDC: fromSerializable(markets.wethUSDC),
    wethDAI: fromSerializable(markets.wethDAI),
  }
}
