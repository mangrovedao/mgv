import type {
  Address,
  Client,
  MulticallParameters,
  ReadContractParameters,
} from 'viem'
import { multicall, readContract } from 'viem/actions'
import {
  type CheckAaveAssetParams,
  type aaveRouterCheckAssetABI,
  checkAaveAssetParams,
} from '../../builder/kandel/aave.js'
import type { BuiltArgs, MarketParams } from '../../index.js'
import { getAction } from '../../utils/getAction.js'

type ReadSingleParams = ReadContractParameters<
  typeof aaveRouterCheckAssetABI,
  'checkAsset'
>

export type CheckAaveAssetArgs = CheckAaveAssetParams &
  Omit<ReadSingleParams, BuiltArgs>

export async function checkAaveAsset(
  client: Client,
  aaveRouter: Address,
  args: CheckAaveAssetArgs,
): Promise<boolean> {
  return getAction(
    client,
    readContract,
    'readContract',
  )({
    ...(args as unknown as ReadSingleParams),
    address: aaveRouter,
    ...checkAaveAssetParams(args),
  })
}

export type CheckAaveAssetsArgs = { tokens: Address[] } & Omit<
  MulticallParameters,
  'contracts' | 'allowFailure'
>

export async function checkAaveAssets(
  client: Client,
  aaveRouter: Address,
  args: CheckAaveAssetsArgs,
): Promise<boolean[]> {
  return getAction(
    client,
    multicall,
    'multicall',
  )({
    ...args,
    contracts: args.tokens.map((token) => ({
      address: aaveRouter,
      ...checkAaveAssetParams({ token }),
    })),
    allowFailure: false,
  })
}

export type CheckAaveMarketArgs = { market: MarketParams } & Omit<
  MulticallParameters,
  'contracts' | 'allowFailure'
>

export async function checkAaveMarket(
  client: Client,
  aaveRouter: Address,
  args: CheckAaveMarketArgs,
): Promise<boolean> {
  const tokens = [args.market.base.address, args.market.quote.address]
  const available = await checkAaveAssets(client, aaveRouter, {
    ...args,
    tokens,
  })
  return available.every((a) => a)
}

export type CheckAaveMarketsArgs = { markets: MarketParams[] } & Omit<
  MulticallParameters,
  'contracts' | 'allowFailure'
>

export async function checkAaveMarkets(
  client: Client,
  aaveRouter: Address,
  args: CheckAaveMarketsArgs,
): Promise<MarketParams[]> {
  const tokens = [
    ...new Set(
      args.markets.flatMap((m) => [
        m.base.address.toLowerCase() as Address,
        m.quote.address.toLowerCase() as Address,
      ]),
    ),
  ]
  const available = await checkAaveAssets(client, aaveRouter, {
    ...args,
    tokens,
  })
  const tokensMap = tokens.reduce((acc, token, i) => {
    acc.set(token, available[i] || false)
    return acc
  }, new Map<Address, boolean>())

  return args.markets.filter(
    (m) =>
      tokensMap.get(m.base.address.toLowerCase() as Address) &&
      tokensMap.get(m.quote.address.toLowerCase() as Address),
  )
}
