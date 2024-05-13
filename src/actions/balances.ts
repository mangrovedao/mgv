import { type Address, type Client, erc20Abi, isAddressEqual } from 'viem'
import type { ContractFunctionParameters, MulticallParameters } from 'viem'
import { multicall } from 'viem/actions'
import type { Logic, OverlyingResponse } from '../addresses/logics/utils.js'
import type { Token } from '../addresses/tokens/utils.js'
import type { MarketParams } from '../types/actions/index.js'
import { getAction } from '../utils/getAction.js'

/**
 * Get the balances for a user
 * @param logics the logics to get balances for
 * @param markets the markets to get balances for
 * @param user the user to get balances for
 */
export type GetBalancesParams<TLogics extends Logic[] = Logic[]> = {
  logics: TLogics
  markets: MarketParams[]
  user: Address
}

export type GetBalancesArgs<TLogics extends Logic[] = Logic[]> =
  GetBalancesParams<TLogics> &
    Omit<MulticallParameters, 'allowFailure' | 'contracts'>

export type OverlyingResult<TLogic extends Logic = Logic> = {
  type: 'erc20' | 'erc721'
  overlying?: Token
  available: boolean
  token: Token
  logic: TLogic
}

export type GetBalanceResult<TLogics extends Logic[] = Logic[]> = {
  tokens: {
    token: Token
    balance: bigint
  }[]
  overlying: OverlyingResult<TLogics[number]>[]
  logicBalances: {
    token: Token
    logic: TLogics[number]
    balance: bigint
  }[]
}

export async function getBalances<TLogics extends Logic[] = Logic[]>(
  client: Client,
  args: GetBalancesArgs<TLogics>,
): Promise<GetBalanceResult<TLogics>> {
  const { logics, markets, ...multicallArgs } = args
  const tokens = markets.reduce((acc, market) => {
    if (!acc.find((t) => isAddressEqual(t.address, market.base.address))) {
      acc.push(market.base)
    }
    if (!acc.find((t) => isAddressEqual(t.address, market.quote.address))) {
      acc.push(market.quote)
    }
    return acc
  }, [] as Token[])

  const tokenBalanceCalls = tokens.map(
    (token) =>
      ({
        address: token.address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [args.user],
      }) as const,
  )

  const overlyingCalls = tokens.flatMap((token) =>
    logics.map((logic) =>
      logic.logicOverlying.getOverlyingContractParams({
        token: token,
        logic: logic,
        name: logic.name,
      }),
    ),
  ) as ContractFunctionParameters[]

  const logicBalancesCalls = tokens.flatMap((token) =>
    logics.map((logic) =>
      logic.logicBalance.getRoutingLogicBalanceParams({
        token: token.address,
        logic: logic.logic,
        name: logic.name,
        user: args.user,
      }),
    ),
  ) as ContractFunctionParameters[]

  const result = await getAction(
    client,
    multicall,
    'multicall',
  )({
    ...multicallArgs,
    contracts: [...tokenBalanceCalls, ...overlyingCalls, ...logicBalancesCalls],
    allowFailure: true,
  })

  const tokenBalances = tokens.map((token, i) => {
    const res = result[i]
    const balance = res.status === 'success' ? (res.result as bigint) : 0n
    return { token, balance }
  })

  const overlying = tokens.flatMap((token, i) =>
    logics.map((logic, j) => {
      const res = result[tokens.length * (i + 1) + j]
      const overlying: OverlyingResponse =
        res.status === 'success'
          ? logic.logicOverlying.parseOverlyingContractResponse(
              {
                token: token,
                logic: logic,
                name: logic.name,
              },
              res.result,
            )
          : {
              type: 'erc20',
              overlying: undefined,
              available: false,
            }
      return { token, logic, ...overlying }
    }),
  )

  const logicBalances = tokens.flatMap((token, i) =>
    logics.map((logic, j) => {
      const res = result[overlying.length + tokens.length * (i + 1) + j]
      const balance = res.status === 'success' ? (res.result as bigint) : 0n
      return { token, logic, balance }
    }),
  )

  return {
    tokens: tokenBalances,
    overlying,
    logicBalances,
  }
}
