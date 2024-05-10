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
} from '../../builder/kandel/retract.js'
import type { BuiltArgs } from '../../index.js'
import { getAction } from '../../utils/getAction.js'

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
