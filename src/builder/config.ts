import { parseAbi, type ContractFunctionParameters } from 'viem'
import { olKeyABIRaw } from './structs.js'
import type { OLKey } from '../types/lib.js'

export const mgvConfigABI = parseAbi([
  olKeyABIRaw,
  'function global() external view returns (uint _global)',
  'function local(OLKey memory olKey) external view returns (uint _local)',
])

/**
 * Parameters for getting the global config.
 * @param olKey the OLKey object
 */
export type GetLocalConfigParams = {
  olKey: OLKey
}

/**
 *
 * @param params get local config params
 * @returns the parameters for getting the local config for viem
 */
export function getLocalConfigParams(params: GetLocalConfigParams) {
  return {
    abi: mgvConfigABI,
    functionName: 'local',
    args: [params.olKey],
  } satisfies Omit<
    ContractFunctionParameters<typeof mgvConfigABI, 'view', 'local'>,
    'address'
  >
}

/**
 *
 * @returns the parameters for getting the global config for viem
 */
export function getGlobalConfigParams() {
  return {
    abi: mgvConfigABI,
    functionName: 'global',
    args: [],
  } satisfies Omit<
    ContractFunctionParameters<typeof mgvConfigABI, 'view', 'global'>,
    'address'
  >
}
