import { globalTestClient } from "../client.js";
import { accounts } from "../constants.js";
import { Address, Hex, parseAbi } from "viem";
import { ERC20_ABI, ERC20_BYTECODE } from "./erc20.js";
import type { OLKey } from "~mgv/types/lib.js"
import { flip } from "~mgv/lib/ol-key.js"
import { olKeyABIRaw } from "~mgv/builder/structs.js"

export async function deployERC20(
  name: string,
  symbol: string,
  decimals: number
): Promise<Address> {
  const res = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    abi: ERC20_ABI,
    bytecode: ERC20_BYTECODE,
    args: [name, symbol, decimals],
  });
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return receipt.contractAddress;
}

export async function deployMangroveCore(bytecode: Hex): Promise<Address> {
  const gasprice = await globalTestClient.getGasPrice();
  const res = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    abi: parseAbi([
      "constructor(address governance, uint gasprice, uint gasmax)",
    ]),
    bytecode,
    args: [accounts[0].address, gasprice / BigInt(1e6), 2_000_000n],
  });
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return receipt.contractAddress;
}

export async function deployMangroveReader(
  mangrove: Address,
  bytecode: Hex
): Promise<Address> {
  const res = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    abi: parseAbi(["constructor(address core)"]),
    bytecode,
    args: [mangrove],
  });
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return receipt.contractAddress;
}

export async function deployRouterProxyFactory(
  bytecode: Hex
): Promise<Address> {
  const res = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    bytecode,
    abi: parseAbi(["constructor()"]),
  });
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return receipt.contractAddress;
}

export async function deployMangroveOrder(
  mangrove: Address,
  factory: Address,
  bytecode: Hex
) {
  const res = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    abi: parseAbi([
      "constructor(address mangrove, address factory, address deployer)",
    ]),
    bytecode,
    args: [mangrove, factory, accounts[0].address],
  });
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return receipt.contractAddress;
}

const openMarketABI = parseAbi([
  olKeyABIRaw,
  'function activate(OLKey memory olKey, uint fee, uint density96X32, uint offer_gasbase) public'
])

const updateMarketABI = parseAbi([
  olKeyABIRaw,
  'function updateMarket(OLKey memory olKey) external'
])

export async function openMarket(
  mangrove: Address,
  reader: Address,
  base: Address,
  quote: Address,
  tickSpacing: bigint,
  fee: bigint,
  baseVolumePerGasUnit: bigint,
  quoteVolumePerGasUnit: bigint,
  offerGasBase: bigint = 170_000n
) {
  const market1: OLKey = {
    outbound_tkn: base,
    inbound_tkn: quote,
    tickSpacing,
  }

  const market2 = flip(market1)

  let tx = await globalTestClient.writeContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    address: mangrove,
    abi: openMarketABI,
    functionName: "activate",
    args: [market1, fee, baseVolumePerGasUnit << 32n, offerGasBase],
  })
  await globalTestClient.waitForTransactionReceipt({ hash: tx })

  tx = await globalTestClient.writeContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    address: mangrove,
    abi: openMarketABI,
    functionName: "activate",
    args: [market2, fee, quoteVolumePerGasUnit << 32n, offerGasBase],
  })
  await globalTestClient.waitForTransactionReceipt({ hash: tx })

  tx = await globalTestClient.writeContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    address: reader,
    abi: updateMarketABI,
    functionName: "updateMarket",
    args: [market1],
  })
  await globalTestClient.waitForTransactionReceipt({ hash: tx })
}
