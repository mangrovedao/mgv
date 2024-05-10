import {
  simulateContract,
  type SimulateContractParameters,
  type SimulateContractReturnType,
} from 'viem/actions'
import {
  type populateABI,
  type PopulateFromOffsetParams,
  populateFromOffsetParams,
  type PopulateChunkFromOffsetParams,
  populateChunkFromOffsetParams,
} from '../../builder/kandel/populate.js'
import type { BuiltArgsWithValue } from '../../index.js'
import type { Address, Client } from 'viem'
import { getAction } from '~mgv/utils/getAction.js'

type SimulationPopulateParams = SimulateContractParameters<
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

type SimulationPopulateChunckParams = SimulateContractParameters<
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
