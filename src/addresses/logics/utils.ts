import type {
  Abi,
  AbiStateMutability,
  Address,
  ContractFunctionName,
  ContractFunctionParameters,
  ContractFunctionReturnType,
} from 'viem'
import type { Token } from '../index.js'

export type OverlyingParams = {
  token: Token
  logic: Logic
  name: string
}

export type OverlyingResponse = {
  type: 'erc20' | 'erc721'
  overlying?: Token | undefined
  available: boolean
}

export type RoutingLogicOverlying<
  abi extends Abi | readonly unknown[] = Abi,
  mutability extends AbiStateMutability = AbiStateMutability,
  functionName extends ContractFunctionName<
    abi,
    mutability
  > = ContractFunctionName<abi, mutability>,
> = {
  getOverlyingContractParams: (
    params: OverlyingParams,
  ) => ContractFunctionParameters<abi, mutability, functionName>
  parseOverlyingContractResponse: (
    params: OverlyingParams,
    response: ContractFunctionReturnType<abi, mutability, functionName>,
  ) => OverlyingResponse
}

export type LogicBalanceParams = {
  token: Address
  logic: Address
  name: string
  user: Address
}

export type LogicBalanceResponse = bigint

export type RoutingLogicBalance<
  abi extends Abi | readonly unknown[] = Abi,
  mutability extends AbiStateMutability = AbiStateMutability,
  functionName extends ContractFunctionName<
    abi,
    mutability
  > = ContractFunctionName<abi, mutability>,
> = {
  getRoutingLogicBalanceParams: (
    params: LogicBalanceParams,
  ) => ContractFunctionParameters<abi, mutability, functionName>
  parseRoutingLogicBalanceResponse: (
    response: ContractFunctionReturnType<abi, mutability, functionName>,
  ) => LogicBalanceResponse
}

export function buildLogic<
  TName extends string = string,
  TLogicAddress extends Address = Address,
  TLogicGasreq extends bigint = bigint,
  abiOverlying extends Abi | readonly unknown[] = Abi,
  mutabilityOverlying extends AbiStateMutability = AbiStateMutability,
  functionNameOverlying extends ContractFunctionName<
    abiOverlying,
    mutabilityOverlying
  > = ContractFunctionName<abiOverlying, mutabilityOverlying>,
  abiBalance extends Abi | readonly unknown[] = Abi,
  mutabilityBalance extends AbiStateMutability = AbiStateMutability,
  functionNameBalance extends ContractFunctionName<
    abiBalance,
    mutabilityBalance
  > = ContractFunctionName<abiBalance, mutabilityBalance>,
>(
  name: TName,
  logic: TLogicAddress,
  gasreq: TLogicGasreq,
  logicOverlying: RoutingLogicOverlying<
    abiOverlying,
    mutabilityOverlying,
    functionNameOverlying
  >,
  logicBalance: RoutingLogicBalance<
    abiBalance,
    mutabilityBalance,
    functionNameBalance
  >,
) {
  return {
    name,
    logic,
    gasreq,
    logicOverlying,
    logicBalance,
  }
}

export type Logic = ReturnType<typeof buildLogic>
