import { type Address, type Client, zeroAddress } from 'viem'
import {
  type CheckAaveAssetArgs,
  type CheckAaveAssetsArgs,
  type CheckAaveMarketArgs,
  type CheckAaveMarketsArgs,
  checkAaveAsset,
  checkAaveAssets,
  checkAaveMarket,
  checkAaveMarkets,
} from '../../actions/kandel/aave.js'
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
  type GetSmartKandelStepsArgs,
  getKandelSteps,
  getSmartKandelSteps,
} from '../../actions/kandel/steps.js'
import {
  type GetKandelStateArgs,
  type GetKandelStateResult,
  getKandelState,
} from '../../actions/kandel/view.js'
import type {
  KandelSteps,
  MangroveActionsDefaultParams,
  MarketParams,
  SmartKandelSteps,
} from '../../index.js'

export type KandelSeederActions = {
  getKandelSteps: (args: GetKandelStepsArgs) => Promise<KandelSteps>
  getSmartKandelSteps: (
    args: GetSmartKandelStepsArgs,
  ) => Promise<SmartKandelSteps>
  simulateSow: (args?: SowArgs | undefined) => Promise<SimulateSowResult>
}

export function kandelSeederActions(market: MarketParams, seeder: Address) {
  return (client: Client): KandelSeederActions => ({
    getKandelSteps: (args: GetKandelStepsArgs) =>
      getKandelSteps(client, market, zeroAddress, args),
    getSmartKandelSteps: (args: GetSmartKandelStepsArgs) =>
      getSmartKandelSteps(client, market, zeroAddress, args),
    simulateSow: (args?: SowArgs | undefined) =>
      simulateSow(client, market, seeder, args),
  })
}

export type KandelActions = {
  getKandelSteps: (args: GetKandelStepsArgs) => Promise<KandelSteps>
  getSmartKandelSteps: (
    args: GetSmartKandelStepsArgs,
  ) => Promise<SmartKandelSteps>
  simulateSetLogics: (args: SetLogicsArgs) => Promise<SetLogicsResult>
  simulatePopulate: (args: PopulateArgs) => Promise<PopulateResult>
  simulatePopulateChunk: (
    args: PopulateChunkArgs,
  ) => Promise<PopulateChunkResult>
  simulateRetract: (args: RetractArgs) => Promise<SimulateRetractResult>
  getKandelState: (args?: GetKandelStateArgs) => Promise<GetKandelStateResult>
}

export function kandelActions(
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  kandel: Address,
) {
  return (client: Client): KandelActions => ({
    getKandelSteps: (args) => getKandelSteps(client, market, kandel, args),
    getSmartKandelSteps: (args) =>
      getSmartKandelSteps(client, market, kandel, args),
    simulateSetLogics: (args) => simulateSetLogics(client, kandel, args),
    simulatePopulate: (args) => simulatePopulate(client, kandel, args),
    simulatePopulateChunk: (args) =>
      simulatePopulateChunk(client, kandel, args),
    simulateRetract: (args) => simulateRetract(client, kandel, args),
    getKandelState: (args = {}) =>
      getKandelState(client, actionParams, market, kandel, args),
  })
}

export type AaveKandelActions = {
  checkAaveAsset: (args: CheckAaveAssetArgs) => Promise<boolean>
  checkAaveAssets: (args: CheckAaveAssetsArgs) => Promise<boolean[]>
  checkAaveMarket: (args: CheckAaveMarketArgs) => Promise<boolean>
  checkAaveMarkets: (args: CheckAaveMarketsArgs) => Promise<MarketParams[]>
}

export function aaveKandelActions(aaveRouter: Address) {
  return (client: Client): AaveKandelActions => ({
    checkAaveAsset: (args) => checkAaveAsset(client, aaveRouter, args),
    checkAaveAssets: (args) => checkAaveAssets(client, aaveRouter, args),
    checkAaveMarket: (args) => checkAaveMarket(client, aaveRouter, args),
    checkAaveMarkets: (args) => checkAaveMarkets(client, aaveRouter, args),
  })
}
