import { http, createTestClient, publicActions, walletActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import { accounts, poolId } from "./constants.js";

export const globalTestClient = createTestClient({
  chain: foundry,
  transport: http(`http://localhost:${process.env.MAIN_PORT || 8546}`),
  mode: "anvil",
  account: privateKeyToAccount(accounts[0].privateKey),
})
  .extend(walletActions)
  .extend(publicActions);

export function getClient() {
  return createTestClient({
    chain: foundry,
    transport: http(
      `http://localhost:${process.env.PROXY_PORT || 8545}/${poolId}`
    ),
    mode: "anvil",
  })
    .extend(walletActions)
    .extend(publicActions);
}
