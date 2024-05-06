import { aaveBalance, aaveOverLying } from '../strategies/aave.js'
import { buildLogic } from '../utils.js'

export const blastOrbitLogic = buildLogic(
  'Orbit',
  '0x3870DAFB80713cad59Dd999c85b1E46314b41e9c',
  600_000n,
  aaveOverLying,
  aaveBalance,
)

export const blastZeroLendLogic = buildLogic(
  'ZeroLend',
  '0x5126d161210654148445AdB3053e6DE2bbeaeefB',
  1_300_000n,
  aaveOverLying,
  aaveBalance,
)

export const blastPacFinanceLogic = buildLogic(
  'PacFinance',
  '0x982A72Afe26C72F7bef644164942BFc1d5D025F8',
  1_300_000n,
  aaveOverLying,
  aaveBalance,
)

export const blastLogics = [
  blastOrbitLogic,
  blastZeroLendLogic,
  blastPacFinanceLogic,
] as const
