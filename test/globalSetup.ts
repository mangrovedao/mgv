import { createAnvil } from "@viem/anvil";
import { globalTestClient } from "src/client.js";
import { accounts } from "src/constants.js";
import { localhost } from "viem/chains";

export const MAIN_PORT = 8546;
export const PROXY_PORT = 8545;

export default async function () {
  // create an anvil instance
  const anvil = createAnvil({
    port: MAIN_PORT,
    chainId: localhost.id,
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

  // deploy mangrove contracts
  // open markets

  // starts a proxy pool from there

  return async () => {
    await anvil.stop();
  };
}
