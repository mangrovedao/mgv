import type {
  Abi,
  Account,
  Address,
  Chain,
  ContractFunctionArgs,
  ContractFunctionName,
  SimulateContractParameters,
} from 'viem'

export type SimulationParams<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  > = ContractFunctionName<abi, 'nonpayable' | 'payable'>,
> = SimulateContractParameters<
  abi,
  functionName,
  ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  Chain | undefined,
  Chain | undefined,
  Account | Address | undefined
>
