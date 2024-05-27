import type { Address, Client, SimulateContractReturnType } from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type SowParams,
  type sowABI,
  sowParams,
} from '../../builder/kandel/sow.js'
import type { BuiltArgs, MarketParams } from '../../index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import { getAction } from '../../utils/getAction.js'

type SowSimulationParams = SimulationParams<typeof sowABI, 'sow'>

export type SowArgs = SowParams & Omit<SowSimulationParams, BuiltArgs>
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
    ...(args as unknown as SowSimulationParams),
    ...sowParams(market, args),
    address: kandelSeeder,
  })
}
