import { type ContractFunctionParameters, parseAbi } from 'viem'
import type { MarketParams } from '../../index.js'
import { olKeyABIRaw } from '../structs.js'

export const sowABI = parseAbi([
  olKeyABIRaw,
  'function sow(OLKey memory olKeyBaseQuote, bool liquiditySharing) external returns (address kandel)',
])

/**
 * @param base the base address
 * @param quote the quote address
 * @param tickSpacing the tick spacing
 * @params liquiditySharing whether to share liquidity (deprecated)
 */
export type SowParams = {
  liquiditySharing?: boolean
}

export function sowParams(market: MarketParams, params?: SowParams) {
  return {
    abi: sowABI,
    functionName: 'sow',
    args: [
      {
        outbound_tkn: market.base.address,
        inbound_tkn: market.quote.address,
        tickSpacing: market.tickSpacing,
      },
      params?.liquiditySharing ?? false,
    ],
  } satisfies Omit<
    ContractFunctionParameters<typeof sowABI, 'nonpayable', 'sow'>,
    'address'
  >
}
