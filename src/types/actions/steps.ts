import type { Address } from 'viem'
import type { OLKey } from '../lib.js'

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
  { token: Address; from: Address; spender: Address; amount: bigint }
>

export type DeployRouterStep = Step<'deployRouter', { owner: Address }>

export type SowKandelStep = Step<'sowKandel', { olKey: OLKey }>

export type BindStep = Step<'bind', { makerContract: Address }>

export type SetKandelLogicsStep = Step<
  'setKandelLogics',
  {
    kandel: Address
    baseLogic: Address
    quoteLogic: Address
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
  DeployRouterStep,
  SowKandelStep,
  BindStep,
  SetKandelLogicsStep,
  ERC20ApprovalStep,
  ERC20ApprovalStep,
]
