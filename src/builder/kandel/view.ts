import { type ContractFunctionParameters, parseAbi } from 'viem'
import { BA } from '../../lib/enums.js'

export const paramsStruct =
  'struct Params { uint32 gasprice; uint24 gasreq; uint32 stepSize; uint32 pricePoints; }' as const

// ba: 0 is bid, 1 is ask
export const viewKandelABI = parseAbi([
  paramsStruct,
  'function baseQuoteTickOffset() public view returns (uint)',
  'function params() public view returns (Params memory)',
  'function offeredVolume(uint8 ba) public view returns (uint volume)',
  'function getOffer(uint8 ba, uint index) public view returns (uint offer)',
  'function offerIdOfIndex(uint8 ba, uint index) public view returns (uint offerId)',
])

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
