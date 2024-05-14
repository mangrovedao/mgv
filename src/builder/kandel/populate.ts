import { type ContractFunctionParameters, parseAbi } from 'viem'
import { paramsStruct } from './view.js'

export const populateABI = parseAbi([
  paramsStruct,
  'function populateFromOffset(uint from, uint to, int baseQuoteTickIndex0, uint _baseQuoteTickOffset, uint firstAskIndex, uint bidGives, uint askGives, Params calldata parameters, uint baseAmount, uint quoteAmount) public payable',
  'function populateChunkFromOffset(uint from, uint to, int baseQuoteTickIndex0, uint firstAskIndex, uint bidGives, uint askGives) public payable',
])

export type PopulateFromOffsetParams = {
  from?: bigint
  to?: bigint
  baseQuoteTickIndex0: bigint
  baseQuoteTickOffset: bigint
  firstAskIndex: bigint
  bidGives: bigint
  askGives: bigint
  gasprice?: bigint
  gasreq: bigint
  stepSize?: bigint
  pricePoints: bigint
  baseAmount?: bigint
  quoteAmount?: bigint
}
export type PopulateChunkFromOffsetParams = {
  from?: bigint
  to: bigint
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
    from = 0n,
    to = pricePoints,
    baseAmount = 0n,
    quoteAmount = 0n,
    gasprice = 0n,
  } = params
  return {
    abi: populateABI,
    functionName: 'populateFromOffset',
    args: [
      from,
      to,
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
    from = 0n,
    to,
  } = params
  return {
    abi: populateABI,
    functionName: 'populateChunkFromOffset',
    args: [from, to, baseQuoteTickIndex0, firstAskIndex, bidGives, askGives],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof populateABI,
      'payable',
      'populateChunkFromOffset'
    >,
    'address'
  >
}
