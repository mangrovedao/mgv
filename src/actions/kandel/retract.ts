import type { Address, Client, SimulateContractReturnType } from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type RetractParams,
  type retractKandelABI,
  retractParams,
} from '../../builder/kandel/retract.js'
import type { BuiltArgs } from '../../index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import { getAction } from '../../utils/getAction.js'

type RetractSimulationParams = SimulationParams<
  typeof retractKandelABI,
  'retractAndWithdraw'
>

export type RetractArgs = RetractParams &
  Omit<RetractSimulationParams, BuiltArgs>

export type SimulateRetractResult = SimulateContractReturnType<
  typeof retractKandelABI,
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
    ...(args as unknown as RetractSimulationParams),
    ...retractParams(args),
    address: kandel,
  })
}
