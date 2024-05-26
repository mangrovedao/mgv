import {
  type Address,
  type ContractFunctionParameters,
  maxUint256,
  parseAbi,
} from 'viem'

export const restractKandelABI = parseAbi([
  'function retractAndWithdraw(uint from, uint to, uint baseAmount, uint quoteAmount, uint freeWei, address recipient) external',
])

export type RetractParams = {
  from?: bigint | undefined
  to: bigint
  baseAmount?: bigint | undefined
  quoteAmount?: bigint | undefined
  freeWei?: bigint | undefined
  recipient: Address
}

export function retractParams(params: RetractParams) {
  const {
    from = 0n,
    to,
    baseAmount = 0n,
    quoteAmount = 0n,
    freeWei = maxUint256,
    recipient,
  } = params

  return {
    abi: restractKandelABI,
    functionName: 'retractAndWithdraw',
    args: [from, to, baseAmount, quoteAmount, freeWei, recipient],
  } satisfies Omit<
    ContractFunctionParameters<
      typeof restractKandelABI,
      'nonpayable',
      'retractAndWithdraw'
    >,
    'address'
  >
}
