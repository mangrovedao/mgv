import type { SimulateContractReturnType } from 'viem'
import type { marketOrderByTickABI } from '../../builder/market-order.js'

export type MarketOrderResult = {
  takerGot: bigint
  takerGave: bigint
  bounty: bigint
  feePaid: bigint
  request: SimulateContractReturnType<
    typeof marketOrderByTickABI,
    'marketOrderByTick'
  >['request']
}
