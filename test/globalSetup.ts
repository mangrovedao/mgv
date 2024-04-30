import { createAnvil, startProxy } from "@viem/anvil";
import { globalTestClient } from "~test/src/client.js";
import { accounts } from "./src/constants.js";
import { foundry } from "viem/chains";
import { getMangroveBytecodes } from "./src/contracts/mangrove.js";
import { Address, parseEther, parseUnits } from "viem";
import {
  deployERC20,
  deployMangroveCore,
  deployMangroveOrder,
  deployMangroveReader,
  deployRouterProxyFactory,
  openMarket,
} from "./src/contracts/index.js";

export let mangrove: Address;
export let mangroveReader: Address;
export let mangroveOrder: Address;
export let routerProxyFactory: Address;

export let WETH: Address;
export let USDC: Address;
export let DAI: Address;

export default async function () {
  // create an anvil instance
  const anvil = createAnvil({
    port: Number(process.env.MAIN_PORT || 8546),
    chainId: foundry.id,
  });
  await anvil.start();

  // setting initial balances of accounts
  for (const account of accounts) {
    await Promise.all([
      globalTestClient.setBalance({
        address: account.address,
        value: account.balance,
      }),
    ]);
  }

  // deploy erc20s and mint to accounts
  WETH = await deployERC20("Wrapped Ether", "WETH", 18);
  USDC = await deployERC20("USD Coin", "USDC", 6);
  DAI = await deployERC20("Dai Stablecoin", "DAI", 18);

  // deploy mangrove contracts
  const data = await getMangroveBytecodes();
  mangrove = await deployMangroveCore(data.mangrove);
  mangroveReader = await deployMangroveReader(mangrove, data.mangroveReader);
  routerProxyFactory = await deployRouterProxyFactory(data.routerProxyFactory);
  mangroveOrder = await deployMangroveOrder(
    mangrove,
    routerProxyFactory,
    data.mangroveOrder
  );

  // open markets

  await openMarket(
    mangrove,
    mangroveReader,
    WETH,
    USDC,
    1n,
    5n,
    parseEther("0.00000001"),
    parseUnits("0.0001", 6)
  );

  await openMarket(
    mangrove,
    mangroveReader,
    WETH,
    DAI,
    1n,
    5n,
    parseEther("0.00000001"),
    parseEther("0.0001")
  );


  // starts a proxy pool from there
  const shutdown = await startProxy({
    port: Number(process.env.PROXY_PORT || 8545),
    options: {
      forkUrl: `http://localhost:${process.env.MAIN_PORT || 8546}`,
    }
  })

  return async () => {
    await shutdown();
    await anvil.stop();
  };
}
