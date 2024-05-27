import type { Address, Client } from 'viem'
import { type SimulateContractReturnType, simulateContract } from 'viem/actions'
import {
  type PopulateChunkFromOffsetParams,
  type PopulateFromOffsetParams,
  type populateABI,
  populateChunkFromOffsetParams,
  populateFromOffsetParams,
} from '../../builder/kandel/populate.js'
import type { BuiltArgsWithValue } from '../../index.js'
import type { SimulationParams } from '../../types/actions/simulation.js'
import { getAction } from '../../utils/getAction.js'

type SimulationPopulateParams = SimulationParams<
  typeof populateABI,
  'populateFromOffset'
>
export type PopulateArgs = PopulateFromOffsetParams &
  Omit<SimulationPopulateParams, BuiltArgsWithValue>

export type PopulateResult = SimulateContractReturnType<
  typeof populateABI,
  'populateFromOffset'
>

export function simulatePopulate(
  client: Client,
  kandel: Address,
  args: PopulateArgs,
): Promise<PopulateResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationPopulateParams),
    ...populateFromOffsetParams(args),
    address: kandel,
  })
}

type SimulationPopulateChunckParams = SimulationParams<
  typeof populateABI,
  'populateChunkFromOffset'
>

export type PopulateChunkArgs = PopulateChunkFromOffsetParams &
  Omit<SimulationPopulateChunckParams, BuiltArgsWithValue>

export type PopulateChunkResult = SimulateContractReturnType<
  typeof populateABI,
  'populateChunkFromOffset'
>

export function simulatePopulateChunk(
  client: Client,
  kandel: Address,
  args: PopulateChunkArgs,
): Promise<PopulateChunkResult> {
  return getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationPopulateChunckParams),
    ...populateChunkFromOffsetParams(args),
    address: kandel,
  })
}
