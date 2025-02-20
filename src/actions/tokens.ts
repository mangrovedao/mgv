import {
  type Address,
  BaseError,
  type Client,
  type MulticallParameters,
  parseAbi,
} from 'viem'
import { multicall } from 'viem/actions'
import { type Token, buildToken } from '../addresses/index.js'
import { getAction } from '../utils/getAction.js'

export type GetTokensParams<T extends readonly Address[] = readonly Address[]> =
  {
    tokens: T
    displayDecimals?: Record<string, number>
    priceDisplayDecimals?: Record<string, number>
    testTokens?: T[number][]
  } & Omit<MulticallParameters, 'contracts' | 'allowFailure'>

export type GetTokensResult<T extends readonly Address[] = readonly Address[]> =
  {
    [K in keyof T]: Token<T[K]>
  }

const tokenABI = parseAbi([
  'function decimals() external view returns (uint8)',
  'function symbol() external view returns (string)',
])

export class GetTokenInfoError extends BaseError {
  constructor(
    tokenAddress: Address,
    param: 'decimals' | 'symbol',
    cause: Error,
  ) {
    super(`No ${param} found for token ${tokenAddress}`, { cause })
  }
}


export async function getTokens<
  T extends readonly Address[] = readonly Address[],
>(
  client: Client,
  {
    tokens,
    displayDecimals = {},
    priceDisplayDecimals = {},
    testTokens = [],
  }: GetTokensParams<T>,
): Promise<GetTokensResult<T>> {

  const tokenInfos = await getAction(
    client,
    multicall,
    'multicall',
  )({
    contracts: tokens.flatMap(
      (token) =>
        [
          {
            address: token,
            abi: tokenABI,
            functionName: 'decimals',
          },
          {
            address: token,
            abi: tokenABI,
            functionName: 'symbol',
          },
        ] as const,
    ),
  })

  return tokens.map((token: T[number], i) => {
    const decimalsResult = tokenInfos[i * 2]
    const symbolResult = tokenInfos[i * 2 + 1]

    if (!decimalsResult || !symbolResult)
      throw new Error(
        'Error while getting token infos, This is a bug, please report at https://github.com/mangrovedao/mgv/issues',
      )
    if (decimalsResult.status === 'failure')
      throw new GetTokenInfoError(token, 'decimals', decimalsResult.error)
    if (symbolResult.status === 'failure')
      throw new GetTokenInfoError(token, 'symbol', symbolResult.error)

    const decimals = decimalsResult.result
    const symbol = symbolResult.result

    if (typeof symbol !== 'string')
      throw new Error(
        'Error while getting token infos, This is a bug, please report at https://github.com/mangrovedao/mgv/issues',
      )
    if (typeof decimals !== 'number')
      throw new Error(
        'Error while getting token infos, This is a bug, please report at https://github.com/mangrovedao/mgv/issues',
      )

    const display = displayDecimals[symbol]
    const priceDisplay = priceDisplayDecimals[symbol]

    return buildToken({
      address: token,
      symbol,
      decimals,
      displayDecimals: display,
      priceDisplayDecimals: priceDisplay,
      mgvTestToken: testTokens.includes(token),
    })
  }) as GetTokensResult<T>
}
