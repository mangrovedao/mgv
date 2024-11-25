import { type ContractFunctionParameters, parseAbi } from 'viem'

export const mgvReaderABI = parseAbi([
  'struct Market { address tkn0; address tkn1; uint tickSpacing;}',
  'struct MarketConfig {LocalUnpacked config01;LocalUnpacked config10;}',
  'struct LocalUnpacked { bool active; uint fee; uint density; uint binPosInLeaf; uint level3; uint level2; uint level1; uint root; uint kilo_offer_gasbase; bool lock; uint last;}',
  'function openMarkets() external view returns (Market[] memory, MarketConfig[] memory)',
])

export const getOpenMarketsParams = {
  abi: mgvReaderABI,
  functionName: 'openMarkets',
} satisfies Omit<
  ContractFunctionParameters<typeof mgvReaderABI, 'view', 'openMarkets'>,
  'address'
>
