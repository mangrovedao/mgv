import type {
  Address,
  Client,
  SimulateContractParameters,
  SimulateContractReturnType,
} from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type SowParams,
  type sowABI,
  sowParams,
} from '../../builder/kandel/sow.js'
import type { BuiltArgs, MarketParams } from '../../index.js'
import { getAction } from '../../utils/getAction.js'

type SimulationParams = SimulateContractParameters<typeof sowABI, 'sow'>

export type SowArgs = SowParams & Omit<SimulationParams, BuiltArgs>
export type SimulateSowResult = SimulateContractReturnType<typeof sowABI, 'sow'>

export async function simulateSow(
  client: Client,
  market: MarketParams,
  kandelSeeder: Address,
  args?: SowArgs | undefined,
): Promise<SimulateSowResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    ...sowParams(market, args),
    address: kandelSeeder,
  })
}
