import { globalTestClient } from "../client.js";
import { accounts } from "../constants.js";
import { Address, Client, Hex, parseAbi } from "viem";
import { writeContract, waitForTransactionReceipt } from "viem/actions";
import { ERC20_ABI, ERC20_BYTECODE } from "./erc20.js";
import type { OLKey } from "~mgv/types/lib.js";
import { flip } from "~mgv/lib/ol-key.js";
import { olKeyABIRaw } from "~mgv/builder/structs.js";
import { bytecode as multicallBytecode } from "./multicall.deployed.bytecode.js";
import { Token, buildToken } from "~mgv/addresses/index.js";
import { MarketParams } from "~mgv/index.js";

export async function deployERC20(
  name: string,
  symbol: string,
  decimals: number
): Promise<Token> {
  const res = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    abi: ERC20_ABI,
    bytecode: ERC20_BYTECODE,
    args: [name, symbol, decimals],
  } as any);
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return buildToken({
    symbol,
    address: receipt.contractAddress,
    decimals
  })
}

export async function deployKandelSeeder(
  mgv: Address,
  kandelGasreq: bigint,
  kandelLib: Address,
  kandelSeederBytecode: Hex
): Promise<Address> {
  const seederTx = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    bytecode: kandelSeederBytecode.replace(/__\$[a-fA-F0-9]{34}\$__/g, kandelLib.slice(2)),
    abi: parseAbi([
      "constructor(address mgv, uint gasreq)",
    ]),
    args: [mgv, kandelGasreq],
  } as any);
  const seederReceipt = await globalTestClient.waitForTransactionReceipt({
    hash: seederTx,
  });
  const seederAddress = seederReceipt.contractAddress;
  return seederAddress;
}

export async function deploySmartKandel(
  mgv: Address,
  kandelGasreq: bigint,
  routerProxyFactory: Address,
  routerImplementation: Address,
  kandelLibBytecode: Hex,
  smartKandelSeederBytecode: Hex
): Promise<{kandelLib: Address, smartKandelSeeder: Address}> {
  const libTx = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    bytecode: kandelLibBytecode,
    abi: parseAbi(["constructor()"]),
  } as any)
  const libReceipt = await globalTestClient.waitForTransactionReceipt({
    hash: libTx,
  });
  const libAddress = libReceipt.contractAddress;
  const seederTx = await globalTestClient.deployContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    bytecode: smartKandelSeederBytecode.replace(/__\$[a-fA-F0-9]{34}\$__/g, libAddress.slice(2)),
    abi: parseAbi([
      "constructor(address mgv, uint gasreq, address routerProxyFactory, address routerImplementation)",
    ]),
    args: [mgv, kandelGasreq, routerProxyFactory, routerImplementation],
  } as any);
  const seederReceipt = await globalTestClient.waitForTransactionReceipt({
    hash: seederTx,
  });
  const seederAddress = seederReceipt.contractAddress;
  return {kandelLib: libAddress, smartKandelSeeder: seederAddress};
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
  } as any);
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
  } as any);
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
  } as any);
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
  } as any);
  const receipt = await globalTestClient.waitForTransactionReceipt({
    hash: res,
  });
  return receipt.contractAddress;
}

const openMarketABI = parseAbi([
  olKeyABIRaw,
  "function activate(OLKey memory olKey, uint fee, uint density96X32, uint offer_gasbase) public",
]);

const updateMarketABI = parseAbi([
  olKeyABIRaw,
  "function updateMarket(OLKey memory olKey) external",
]);

export async function openMarket(
  mangrove: Address,
  reader: Address,
  base: Token,
  quote: Token,
  tickSpacing: bigint,
  fee: bigint,
  baseVolumePerGasUnit: bigint,
  quoteVolumePerGasUnit: bigint,
  offerGasBase: bigint = 170_000n
): Promise<MarketParams> {
  const market1: OLKey = {
    outbound_tkn: base.address,
    inbound_tkn: quote.address,
    tickSpacing,
  };

  const market2 = flip(market1);

  let tx = await globalTestClient.writeContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    address: mangrove,
    abi: openMarketABI,
    functionName: "activate",
    args: [market1, fee, baseVolumePerGasUnit << 32n, offerGasBase],
  });
  await globalTestClient.waitForTransactionReceipt({ hash: tx });

  tx = await globalTestClient.writeContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    address: mangrove,
    abi: openMarketABI,
    functionName: "activate",
    args: [market2, fee, quoteVolumePerGasUnit << 32n, offerGasBase],
  });
  await globalTestClient.waitForTransactionReceipt({ hash: tx });

  tx = await globalTestClient.writeContract({
    account: globalTestClient.account,
    chain: globalTestClient.chain,
    address: reader,
    abi: updateMarketABI,
    functionName: "updateMarket",
    args: [market1],
  });
  await globalTestClient.waitForTransactionReceipt({ hash: tx });
  return {
    base,
    quote,
    tickSpacing,
  }
}

export async function setMulticall(address: Address) {
  await globalTestClient.setCode({
    address,
    bytecode: multicallBytecode,
  })
}

export async function mint(
  client: Client,
  token: Address,
  to: Address,
  amount: bigint
) {
  const res = await writeContract(client, {
    address: token,
    abi: ERC20_ABI,
    functionName: "mint",
    args: [to, amount],
  } as any);
  await waitForTransactionReceipt(client, { hash: res });
}

export async function approve(
  client: Client,
  token: Address,
  owner: Address,
  spender: Address,
  amount: bigint
) {
  const res = await writeContract(client, {
    address: token,
    abi: ERC20_ABI,
    functionName: "approve",
    args: [spender, amount],
  } as any);
  await waitForTransactionReceipt(client, { hash: res });
}

export async function mintAndApprove(
  client: Client,
  token: Address,
  to: Address,
  amount: bigint,
  spender: Address
) {
  await mint(client, token, to, amount)
  await approve(client, token, to, spender, amount)
}
