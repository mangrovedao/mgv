import type {
  Address,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
} from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type RetractParams,
  type restractKandelABI,
  retractParams,
} from '~mgv/builder/kandel/retract.js'
import type { BuiltArgs } from '~mgv/index.js'
import { getAction } from '~mgv/utils/getAction.js'

type SimulationParams = SimulateContractParameters<
  typeof restractKandelABI,
  'retractAndWithdraw'
>

export type RetractArgs = RetractParams & Omit<SimulationParams, BuiltArgs>

export type SimulateRetractResult = SimulateContractReturnType<
  typeof restractKandelABI,
  'retractAndWithdraw'
>

export async function simulateRetract(
  client: Client,
  kandel: Address,
  args: RetractArgs,
): Promise<SimulateRetractResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...retractParams(args),
    address: kandel,
  })
}
