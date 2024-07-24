import {
  type ContractFunctionParameters,
  type ContractFunctionReturnType,
  parseAbi,
} from 'viem'

export const openMarketsABI = parseAbi([
  'struct Market { address tkn0; address tkn1; uint tickSpacing; }',
  'struct LocalUnpacked { bool active; uint fee; uint rawDensity; uint binPosInLeaf; uint level3; uint level2; uint level1; uint root; uint kilo_offer_gasbase; bool lock; uint last;}',
  'struct MarketConfig { LocalUnpacked config01; LocalUnpacked config10; }',
  'function openMarkets() external view returns (Market[] memory, MarketConfig[] memory)',
])

/**
 *
 * @param params market order params
 * @returns the parameters for a market order by tick for viem
 * @example
 *
 * ```ts
 * walletClient.writeContract({
 *   address: "0x...",
 *   ...marketOrderParams({
 *     ...
 *   })
 * });
 * ```
 *
 */
export function openMarketsParams() {
  return {
    abi: openMarketsABI,
    functionName: 'openMarkets',
    args: [],
  } satisfies Omit<
    ContractFunctionParameters<typeof openMarketsABI, 'view', 'openMarkets'>,
    'address'
  >
}

export type ParseOpenMarketsParams = {
  result: ContractFunctionReturnType<
    typeof openMarketsABI,
    'view',
    'openMarkets'
  >
}

/**
 *
 * @param result the result of open markets
 * @returns the parsed open markets result
 */
export function parseBookResult({
  result,
}: ParseOpenMarketsParams): CompleteOffer[] {
  const [_, offerIDs, offersPacked, offerDetailsPacked] = result
  return offerIDs.map((id, i) => {
    const offer = unpackOffer(offersPacked[i]!)
    const detail = unpackOfferDetail(offerDetailsPacked[i]!)
    const humanReadableParams = rpcOfferToHumanOffer({
      ...offer,
      ba,
      baseDecimals,
      quoteDecimals,
    })
    return {
      id,
      offer,
      detail,
      ...humanReadableParams,
    }
  })
}
