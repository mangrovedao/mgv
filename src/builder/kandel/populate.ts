import { type ContractFunctionParameters, parseAbi } from 'viem'
import { paramsStruct } from './view.js'

export const populateABI = parseAbi([
  paramsStruct,
  'function populateFromOffset(uint from, uint to, int baseQuoteTickIndex0, uint _baseQuoteTickOffset, uint firstAskIndex, uint bidGives, uint askGives, Params calldata parameters, uint baseAmount, uint quoteAmount) public payable',
  'function populateChunkFromOffset(uint from, uint to, int baseQuoteTickIndex0, uint firstAskIndex, uint bidGives, uint askGives) public payable',
])

export type PopulateFromOffsetParams = {
  fromIndex?: bigint | undefined
  toIndex?: bigint | undefined
  baseQuoteTickIndex0: bigint
  baseQuoteTickOffset: bigint
  firstAskIndex: bigint
  bidGives: bigint
  askGives: bigint
  gasprice?: bigint | undefined
  gasreq: bigint
  stepSize?: bigint | undefined
  pricePoints: bigint
  baseAmount?: bigint | undefined
  quoteAmount?: bigint | undefined
}
export type PopulateChunkFromOffsetParams = {
  fromIndex?: bigint | undefined
  toIndex: bigint
  baseQuoteTickIndex0: bigint
  firstAskIndex: bigint
  bidGives: bigint
  askGives: bigint
}
export function populateFromOffsetParams(params: PopulateFromOffsetParams) {
  const {
    baseQuoteTickIndex0,
    baseQuoteTickOffset,
    firstAskIndex,
    bidGives,
    askGives,
    gasreq,
    pricePoints,
    stepSize,
    fromIndex = 0n,
    toIndex = pricePoints,
    baseAmount = 0n,
    quoteAmount = 0n,
    gasprice = 0n,
  } = params
  return {
    abi: populateABI,
    functionName: 'populateFromOffset',
    args: [
      fromIndex,
      toIndex,
      baseQuoteTickIndex0,
      baseQuoteTickOffset,
      firstAskIndex,
      bidGives,
      askGives,
      {
        gasprice: Number(gasprice),
        gasreq: Number(gasreq),
        stepSize: Number(stepSize),
        pricePoints: Number(pricePoints),
      },
      baseAmount,
      quoteAmount,
    ],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof populateABI,
      'payable',
      'populateFromOffset'
    >,
    'address'
  >
}

export function populateChunkFromOffsetParams(
  params: PopulateChunkFromOffsetParams,
) {
  const {
    baseQuoteTickIndex0,
    firstAskIndex,
    bidGives,
    askGives,
    fromIndex = 0n,
    toIndex,
  } = params
  return {
    abi: populateABI,
    functionName: 'populateChunkFromOffset',
    args: [
      fromIndex,
      toIndex,
      baseQuoteTickIndex0,
      firstAskIndex,
      bidGives,
      askGives,
    ],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof populateABI,
      'payable',
      'populateChunkFromOffset'
    >,
    'address'
  >
}
