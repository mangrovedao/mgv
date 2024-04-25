import type { Address } from 'viem'

export type Market = {
  base: Address
  quote: Address
  tickSpacing: bigint
}
