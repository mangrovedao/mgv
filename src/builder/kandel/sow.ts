import { type Address, type ContractFunctionParameters, parseAbi } from 'viem'
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
  base: Address
  quote: Address
  tickSpacing: bigint
  liquiditySharing?: boolean
}

export function sowParams(params: SowParams) {
  return {
    abi: sowABI,
    functionName: 'sow',
    args: [
      {
        outbound_tkn: params.base,
        inbound_tkn: params.quote,
        tickSpacing: params.tickSpacing,
      },
      params.liquiditySharing ?? false,
    ],
  } satisfies Omit<
    ContractFunctionParameters<typeof sowABI, 'nonpayable', 'sow'>,
    'address'
  >
}
