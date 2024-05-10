import type {
  Address,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
} from 'viem'
import {
  setLogicsParams,
  type SetLogicsParams,
  type logicsABI,
} from '../../builder/kandel/logic.js'
import type { BuiltArgs } from '../../types/actions/index.js'
import { simulateContract } from 'viem/actions'
import { getAction } from '../../utils/getAction.js'

type SimulationParams = SimulateContractParameters<
  typeof logicsABI,
  'setLogics'
>

export type SetLogicsArgs = SetLogicsParams & Omit<SimulationParams, BuiltArgs>
export type SetLogicsResult = SimulateContractReturnType<
  typeof logicsABI,
  'setLogics'
>

export async function simulateSetLogics(
  client: Client,
  kandel: Address,
  args: SetLogicsArgs,
): Promise<SetLogicsResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...setLogicsParams(args),
    address: kandel,
  })
}
