import type { BuiltArgs } from '../../index.js'
import {
  sowParams,
  type SowParams,
  type sowABI,
} from '../../builder/kandel/sow.js'
import type {
  Address,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
} from 'viem'
import { getAction } from '../../utils/getAction.js'
import { simulateContract } from 'viem/actions'

type SimulationParams = SimulateContractParameters<typeof sowABI, 'sow'>

export type SowArgs = SowParams & Omit<SimulationParams, BuiltArgs>
export type SimulateSowResult = SimulateContractReturnType<typeof sowABI, 'sow'>

export async function simulateSow(
  client: Client,
  kandelSeeder: Address,
  args: SowArgs,
): Promise<SimulateSowResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...sowParams(args),
    address: kandelSeeder,
  })
}
