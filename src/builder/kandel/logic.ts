import { parseAbi, type Address, type ContractFunctionParameters } from 'viem'

export const logicsABI = parseAbi([
  'function setLogics(address baseLogic, address quoteLogic, uint gasreq) public',
  'function getLogics() public view returns (address baseLogic, address quoteLogic)',
])

export type SetLogicsParams = {
  baseLogic: Address
  quoteLogic: Address
  gasreq: bigint
}

export function setLogicsParams(params: SetLogicsParams) {
  return {
    abi: logicsABI,
    functionName: 'setLogics',
    args: [params.baseLogic, params.quoteLogic, params.gasreq],
  } satisfies Omit<
    ContractFunctionParameters<typeof logicsABI, 'nonpayable', 'setLogics'>,
    'address'
  >
}

export function getLogicsParams() {
  return {
    abi: logicsABI,
    functionName: 'getLogics',
    args: [],
  } satisfies Omit<
    ContractFunctionParameters<typeof logicsABI, 'view', 'getLogics'>,
    'address'
  >
}
