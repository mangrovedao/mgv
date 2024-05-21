import type { Address } from 'viem'
import type { Logic, MarketParams, Token } from '../../index.js'

export type Step<
  TType extends string,
  TParams extends Record<string, unknown>,
> = {
  type: TType
  params: TParams
  done: boolean
}

export type ERC20ApprovalStep = Step<
  'erc20Approval',
  { token: Token; from: Address; spender: Address; amount: bigint }
>

export type DeployRouterStep = Step<'deployRouter', { owner: Address }>

export type SowKandelStep = Step<'sowKandel', { market: MarketParams }>

export type BindStep = Step<'bind', { makerContract: Address }>

export type SetKandelLogicsStep = Step<
  'setKandelLogics',
  {
    kandel: Address
    baseLogic?: Logic
    quoteLogic?: Logic
    gasRequirement: bigint
  }
>

export type MarketOrderSteps = readonly [ERC20ApprovalStep]
export type LimitOrderSteps = readonly [ERC20ApprovalStep]
export type NewOfferSteps = readonly [ERC20ApprovalStep]
export type AmplifiedOrderSteps = readonly [
  DeployRouterStep,
  BindStep,
  ERC20ApprovalStep,
  ERC20ApprovalStep,
]
export type KandelSteps = readonly [
  SowKandelStep,
  DeployRouterStep,
  BindStep,
  SetKandelLogicsStep,
  ERC20ApprovalStep,
  ERC20ApprovalStep,
]
