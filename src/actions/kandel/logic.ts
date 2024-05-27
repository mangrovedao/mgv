import type { Address, Client, SimulateContractReturnType } from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type SetLogicsParams,
  type logicsABI,
  setLogicsParams,
} from '../../builder/kandel/logic.js'
import type { BuiltArgs } from '../../types/actions/index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import { getAction } from '../../utils/getAction.js'

type SetLogicSimulationParams = SimulationParams<typeof logicsABI, 'setLogics'>

export type SetLogicsArgs = SetLogicsParams &
  Omit<SetLogicSimulationParams, BuiltArgs>
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
    ...(args as unknown as SetLogicSimulationParams),
    ...setLogicsParams(args),
    address: kandel,
  })
}
