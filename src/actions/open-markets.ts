// import type { SimulationParams } from '~mgv/types/actions/simulation.js'
// import type { openMarketsABI } from '../builder/open-markets.js'
import type { Client, ContractFunctionReturnType } from "viem";
import { multicall } from "viem/actions";

import type { OpenMarketsResult } from "~mgv/types/actions/open-markets.js";
import type { MangroveActionsDefaultParams } from "~mgv/types/index.js";
import {
  openMarketsABI,
  openMarketsParams,
  parseOpenMarketResult,
} from "../builder/open-markets.js";
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

  const parsedOpenMarkets = await parseOpenMarketResult({
    client,
    result: result[0],
  });

  return parsedOpenMarkets;
}
