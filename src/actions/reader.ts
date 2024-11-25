import type { Address, Client, ContractFunctionParameters } from 'viem'
import { readContract } from 'viem/actions'
import { getOpenMarketsParams, type mgvReaderABI } from '../builder/reader.js'
import type {
  BuiltArgs,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../types/index.js'
import { getAction } from '../utils/getAction.js'
import { type GetTokensParams, getTokens } from './tokens.js'

export type GetOpenMarketRawArgs = Omit<
  ContractFunctionParameters<typeof mgvReaderABI, 'view', 'openMarkets'>,
  BuiltArgs
>

export type GetOpenMarketRawResult = {
  tkn0: Address
  tkn1: Address
  tickSpacing: bigint
}[]

export async function getRawOpenMarkets(
  client: Client,
  params: MangroveActionsDefaultParams,
  args?: GetOpenMarketRawArgs,
): Promise<GetOpenMarketRawResult> {
  const result = await getAction(
    client,
    readContract,
    'readContract',
  )({
    ...args,
    address: params.mgvReader,
    ...getOpenMarketsParams,
  })

  return result[0] as GetOpenMarketRawResult
}

export type GetOpenMarketArgs = Omit<GetTokensParams, 'tokens'> &
  GetOpenMarketRawArgs & {
    // symbol -> cashness
    cashnesses: Record<string, number>
  }

export type GetOpenMarketResult = MarketParams[]

export async function getOpenMarkets(
  client: Client,
  params: MangroveActionsDefaultParams,
  args: GetOpenMarketArgs,
): Promise<GetOpenMarketResult> {
  const raw = await getRawOpenMarkets(client, params, args)
  const tokens = await getTokens(client, {
    ...args,
    tokens: raw.flatMap((market) => [market.tkn0, market.tkn1]),
  })

  return raw.map((market): MarketParams => {
    // we don't use isAddressEqual because both are supposedly checksummed from viem
    const tkn0 = tokens.find((token) => token.address === market.tkn0)
    const tkn1 = tokens.find((token) => token.address === market.tkn1)

    if (!tkn0 || !tkn1) {
      throw new Error(
        'Token not found, this is a bug, please report at https://github.com/mangrovedao/mgv/issues',
      )
    }

    const tkn0Cashness = args.cashnesses[tkn0.symbol] ?? 0
    const tkn1Cashness = args.cashnesses[tkn1.symbol] ?? 0

    return {
      base: tkn0Cashness > tkn1Cashness ? tkn1 : tkn0,
      quote: tkn0Cashness > tkn1Cashness ? tkn0 : tkn1,
      tickSpacing: market.tickSpacing,
    }
  })
}
