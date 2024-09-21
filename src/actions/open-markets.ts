// import type { SimulationParams } from '~mgv/types/actions/simulation.js'
// import type { openMarketsABI } from '../builder/open-markets.js'
import type { Client } from "viem";
import { multicall } from "viem/actions";

import type { OpenMarketsResult } from "~mgv/types/actions/open-markets.js";
import type { MangroveActionsDefaultParams } from "~mgv/types/index.js";
import { openMarketsParams } from "../builder/open-markets.js";
import { getAction } from "../utils/getAction.js";

export async function getOpenMarkets(
  client: Client,
  actionParams: MangroveActionsDefaultParams
): Promise<OpenMarketsResult> {
  const { mgvReader } = actionParams;

  const result = await getAction(
    client,
    multicall,
    "multicall"
  )({
    contracts: [
      {
        address: mgvReader,
        ...openMarketsParams(),
      },
    ],
    allowFailure: false,
  });

  // const tokens = result[0][0].map((item, i) => {
  //   return { base: item.tkn0, quote: item.tkn1 };
  // });

  // const formattedTokens = await getAction(
  //   client,
  //   multicall,
  //   'multicall',
  // )({
  //   contracts: [
  //     {
  //       address: tokens[0]?.quote || '0x',
  //       ...openMarketsParams(),
  //     },
  //   ],
  //   allowFailure: false,
  // })

  console.log("okokoko", result[0][0], result[0][1]);

  // const markets = parseMarkets(markets)
  // const marketsConfigs = parseMarketsConfigs(marketsConfigs)

  return {
    markets: result[0][0],
    marketsConfigs: result[0][1],
  } as unknown as OpenMarketsResult;
}
