import { type Address, type Client, zeroAddress } from 'viem'
import {
  type SetLogicsArgs,
  type SetLogicsResult,
  simulateSetLogics,
} from '../../actions/kandel/logic.js'
import {
  type PopulateArgs,
  type PopulateChunkArgs,
  type PopulateChunkResult,
  type PopulateResult,
  simulatePopulate,
  simulatePopulateChunk,
} from '../../actions/kandel/populate.js'
import {
  type RetractArgs,
  type SimulateRetractResult,
  simulateRetract,
} from '../../actions/kandel/retract.js'
import {
  type SimulateSowResult,
  type SowArgs,
  simulateSow,
} from '../../actions/kandel/sow.js'
import {
  type GetKandelStepsArgs,
  getKandelSteps,
} from '../../actions/kandel/steps.js'
import {
  type GetKandelStateArgs,
  type GetKandelStateResult,
  getKandelState,
} from '../../actions/kandel/view.js'
import type { KandelSteps, MarketParams } from '../../index.js'

export type KandelSeederActions = {
  getKandelSteps: (args: GetKandelStepsArgs) => Promise<KandelSteps>
  simulateSow: (args?: SowArgs | undefined) => Promise<SimulateSowResult>
}

export function kandelSeederActions(market: MarketParams, seeder: Address) {
  return (client: Client): KandelSeederActions => ({
    getKandelSteps: (args: GetKandelStepsArgs) =>
      getKandelSteps(client, market, zeroAddress, args),
    simulateSow: (args?: SowArgs | undefined) =>
      simulateSow(client, market, seeder, args),
  })
}

export type KandelActions = {
  getKandelSteps: (args: GetKandelStepsArgs) => Promise<KandelSteps>
  simulateSetLogics: (args: SetLogicsArgs) => Promise<SetLogicsResult>
  simulatePopulate: (args: PopulateArgs) => Promise<PopulateResult>
  simulatePopulateChunk: (
    args: PopulateChunkArgs,
  ) => Promise<PopulateChunkResult>
  simulateRetract: (args: RetractArgs) => Promise<SimulateRetractResult>
  getKandelState: (args: GetKandelStateArgs) => Promise<GetKandelStateResult>
}

export function kandelActions(market: MarketParams, kandel: Address) {
  return (client: Client): KandelActions => ({
    getKandelSteps: (args: GetKandelStepsArgs) =>
      getKandelSteps(client, market, kandel, args),
    simulateSetLogics: (args: SetLogicsArgs) =>
      simulateSetLogics(client, kandel, args),
    simulatePopulate: (args: PopulateArgs) =>
      simulatePopulate(client, kandel, args),
    simulatePopulateChunk: (args: PopulateChunkArgs) =>
      simulatePopulateChunk(client, kandel, args),
    simulateRetract: (args: RetractArgs) =>
      simulateRetract(client, kandel, args),
    getKandelState: (args: GetKandelStateArgs) =>
      getKandelState(client, market, kandel, args),
  })
}
