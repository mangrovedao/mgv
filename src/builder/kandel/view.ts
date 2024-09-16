import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BA } from '../../lib/enums.js'
import type { OLKey } from '../../types/lib.js'
import { olKeyABIRaw } from '../structs.js'

export const paramsStruct =
  'struct Params { uint32 gasprice; uint24 gasreq; uint32 stepSize; uint32 pricePoints; }' as const

// ba: 0 is bid, 1 is ask
export const viewKandelABI = parseAbi([
  paramsStruct,
  olKeyABIRaw,
  'function baseQuoteTickOffset() public view returns (uint)',
  'function params() public view returns (Params memory)',
  'function reserveBalance(uint8 ba) public view returns (uint balance)',
  'function offeredVolume(uint8 ba) public view returns (uint volume)',
  'function getOffer(uint8 ba, uint index) public view returns (uint offer)',
  'function offerIdOfIndex(uint8 ba, uint index) public view returns (uint offerId)',
  'function provisionOf(OLKey memory olKey, uint offerId) public view returns (uint provision)',
  'function BASE() public view returns (address)',
  'function QUOTE() public view returns (address)',
  'function TICK_SPACING() public view returns (uint)',
])

export const baseParams = {
  abi: viewKandelABI,
  functionName: 'BASE',
} satisfies Omit<
  ContractFunctionParameters<typeof viewKandelABI, 'view', 'BASE'>,
  'address'
>

export const quoteParams = {
  abi: viewKandelABI,
  functionName: 'QUOTE',
} satisfies Omit<
  ContractFunctionParameters<typeof viewKandelABI, 'view', 'QUOTE'>,
  'address'
>

export const tickSpacingParams = {
  abi: viewKandelABI,
  functionName: 'TICK_SPACING',
} satisfies Omit<
  ContractFunctionParameters<typeof viewKandelABI, 'view', 'TICK_SPACING'>,
  'address'
>

export const baseQuoteTickOffsetParams = {
  abi: viewKandelABI,
  functionName: 'baseQuoteTickOffset',
} satisfies Omit<
  ContractFunctionParameters<
    typeof viewKandelABI,
    'view',
    'baseQuoteTickOffset'
  >,
  'address'
>

export const kandelParamsParams = {
  abi: viewKandelABI,
  functionName: 'params',
} satisfies Omit<
  ContractFunctionParameters<typeof viewKandelABI, 'view', 'params'>,
  'address'
>

function parseBA(ba: BA) {
  return ba === BA.bids ? 0 : 1
}

export function reserveBalanceParams(ba: BA) {
  return {
    abi: viewKandelABI,
    functionName: 'reserveBalance',
    args: [parseBA(ba)],
  } satisfies Omit<
    ContractFunctionParameters<typeof viewKandelABI, 'view', 'reserveBalance'>,
    'address'
  >
}

export function offeredVolumeParams(ba: BA) {
  return {
    abi: viewKandelABI,
    functionName: 'offeredVolume',
    args: [parseBA(ba)],
  } satisfies Omit<
    ContractFunctionParameters<typeof viewKandelABI, 'view', 'offeredVolume'>,
    'address'
  >
}

export function getOfferParams(ba: BA, index: bigint) {
  return {
    abi: viewKandelABI,
    functionName: 'getOffer',
    args: [parseBA(ba), index],
  } satisfies Omit<
    ContractFunctionParameters<typeof viewKandelABI, 'view', 'getOffer'>,
    'address'
  >
}

export function offerIdOfIndexParams(ba: BA, index: bigint) {
  return {
    abi: viewKandelABI,
    functionName: 'offerIdOfIndex',
    args: [parseBA(ba), index],
  } satisfies Omit<
    ContractFunctionParameters<typeof viewKandelABI, 'view', 'offerIdOfIndex'>,
    'address'
  >
}

export function provisionOfParams(olKey: OLKey, offerId: bigint) {
  return {
    abi: viewKandelABI,
    functionName: 'provisionOf',
    args: [olKey, offerId],
  } satisfies Omit<
    ContractFunctionParameters<typeof viewKandelABI, 'view', 'provisionOf'>,
    'address'
  >
}
