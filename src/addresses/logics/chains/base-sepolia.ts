import { aaveBalance, aaveOverLying } from '../strategies/aave.js'
import { buildLogic } from '../utils.js'

export const baseSepoliaAave = buildLogic(
  'Aave',
  '0xF1E3f817fF9CaAF7083a58C50a3c4a05f80dE565',
  1_300_000n,
  aaveOverLying,
  aaveBalance,
)

export const baseSepoliaLogics = [baseSepoliaAave] as const
