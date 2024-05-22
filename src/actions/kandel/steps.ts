import {
  type Address,
  type Client,
  type MulticallParameters,
  isAddressEqual,
  maxUint128,
  maxUint256,
  parseAbi,
  zeroAddress,
} from 'viem'
import { multicall } from 'viem/actions'
import { getLogicsParams } from '../../builder/kandel/logic.js'
// import { getParamsParams } from '../../builder/kandel/populate.js'
import { tokenAllowanceParams } from '../../builder/tokens.js'
import type { KandelSteps, MarketParams } from '../../index.js'
import { getKandelGasReq } from '../../lib/kandel/params.js'
import { getAction } from '../../utils/getAction.js'
import type { OverlyingResult } from '../balances.js'

export const routerABI = parseAbi([
  'function admin() public view returns (address current)',
  'function isBound(address mkr) public view returns (bool)',
])

// => Deploy user router instance if not exist
// => Create kandel instance
// => Bind the router with the kandel
// => Set the logics for the kandel
// => Approve the tokens for the kandel (2 steps)
// => populate the kandel

export type GetKandelStepsParams = {
  userRouter: Address
  user: Address
  baseOverlying?: OverlyingResult
  quoteOverlying?: OverlyingResult
}

export type GetKandelStepsArgs = GetKandelStepsParams &
  Omit<MulticallParameters, 'contracts' | 'allowFailure'>

export async function getKandelSteps(
  client: Client,
  market: MarketParams,
  kandel: Address,
  args: GetKandelStepsArgs,
): Promise<KandelSteps> {
  const [admin, bound, logics, /*params,*/ baseAllowance, quoteAllowance] =
    await getAction(
      client,
      multicall,
      'multicall',
    )({
      ...args,
      contracts: [
        {
          address: args.userRouter,
          abi: routerABI,
          functionName: 'admin',
        },
        {
          address: args.userRouter,
          abi: routerABI,
          functionName: 'isBound',
          args: [kandel],
        },
        {
          address: kandel,
          ...getLogicsParams(),
        },
        // {
        //   address: args.kandel || zeroAddress,
        //   ...getParamsParams(),
        // },
        {
          ...tokenAllowanceParams({
            owner: args.user,
            spender: args.userRouter,
            token:
              args.baseOverlying?.available && args.baseOverlying.overlying
                ? args.baseOverlying.overlying.address
                : market.base.address,
          }),
        },
        {
          ...tokenAllowanceParams({
            owner: args.user,
            spender: args.userRouter,
            token:
              args.quoteOverlying?.available && args.quoteOverlying.overlying
                ? args.quoteOverlying.overlying.address
                : market.quote.address,
          }),
        },
      ],
      allowFailure: true,
    })

  const gasreq = getKandelGasReq({
    baseLogic: args.baseOverlying?.logic,
    quoteLogic: args.quoteOverlying?.logic,
  })

  return [
    {
      type: 'sowKandel',
      params: {
        market,
      },
      done: !isAddressEqual(kandel, zeroAddress),
    },
    {
      type: 'deployRouter',
      params: {
        owner: args.user,
      },
      done:
        admin.status === 'success' && isAddressEqual(admin.result, args.user),
    },
    {
      type: 'bind',
      params: {
        makerContract: kandel,
      },
      done:
        bound.status === 'success' &&
        bound.result &&
        !isAddressEqual(kandel, zeroAddress),
    },
    {
      type: 'setKandelLogics',
      params: {
        kandel,
        baseLogic: args.baseOverlying?.logic,
        quoteLogic: args.quoteOverlying?.logic,
        gasRequirement: gasreq,
      },
      done:
        (logics.status === 'success' &&
          isAddressEqual(
            logics.result[0],
            args.baseOverlying?.logic.logic || zeroAddress,
          ) &&
          isAddressEqual(
            logics.result[1],
            args.quoteOverlying?.logic.logic || zeroAddress,
          )) ||
        (logics.status === 'failure' &&
          isAddressEqual(
            args.baseOverlying?.logic.logic || zeroAddress,
            zeroAddress,
          ) &&
          isAddressEqual(
            args.quoteOverlying?.logic.logic || zeroAddress,
            zeroAddress,
          )), // setting the gasreq in the populate instead of set logic
    },
    {
      type: 'erc20Approval',
      params: {
        token:
          args.baseOverlying?.available && args.baseOverlying.overlying
            ? args.baseOverlying.overlying
            : market.base,
        from: args.user,
        spender: args.userRouter,
        amount: maxUint256,
      },
      done:
        baseAllowance.status === 'success' && baseAllowance.result > maxUint128,
    },
    {
      type: 'erc20Approval',
      params: {
        token:
          args.quoteOverlying?.available && args.quoteOverlying.overlying
            ? args.quoteOverlying.overlying
            : market.quote,
        from: args.user,
        spender: args.userRouter,
        amount: maxUint256,
      },
      done:
        quoteAllowance.status === 'success' &&
        quoteAllowance.result > maxUint128,
    },
    {
      type: 'populate',
      params: {
        gasreq,
      },
      done: false,
    },
  ]
}
