import {
  type ContractFunctionParameters,
  type ContractFunctionReturnType,
  parseAbi,
} from "viem";
import type { Client } from "viem";

import { multicall } from "viem/actions";
import type { Token } from "~mgv/_types/index.js";
import { buildToken } from "~mgv/addresses/index.js";
import type { OpenMarketsResult } from "~mgv/types/actions/open-markets.js";
import type { LocalConfig } from "~mgv/types/lib.js";
import { getAction } from "~mgv/utils/getAction.js";

export const openMarketsABI = parseAbi([
  "struct Market { address tkn0; address tkn1; uint tickSpacing; }",
  "struct LocalUnpacked { bool active; uint fee; uint rawDensity; uint binPosInLeaf; uint level3; uint level2; uint level1; uint root; uint kilo_offer_gasbase; bool lock; uint last;}",
  "struct MarketConfig { LocalUnpacked config01; LocalUnpacked config10; }",
  "function openMarkets() external view returns (Market[] memory, MarketConfig[] memory)",
]);

/**
 *
 * @param params market order params
 * @returns the parameters for a market order by tick for viem
 * @example
 *
 * ```ts
 * walletClient.writeContract({
 *   address: "0x...",
 *   ...marketOrderParams({
 *     ...
 *   })
 * });
 * ```
 *
 */
export function openMarketsParams() {
  return {
    abi: openMarketsABI,
    functionName: "openMarkets",
    args: [],
  } satisfies Omit<
    ContractFunctionParameters<typeof openMarketsABI, "view", "openMarkets">,
    "address"
  >;
}

export type ParseOpenMarketsParams = {
  client: Client;
  result: ContractFunctionReturnType<
    typeof openMarketsABI,
    "view",
    "openMarkets"
  >;
};

/**
 *
 * @param result the result of open markets
 * @returns the parsed open markets result
 */
export async function parseOpenMarketResult({
  client,
  result,
}: ParseOpenMarketsParams): Promise<OpenMarketsResult> {
  const [rawMarkets, rawMarketsConfigs] = result;

  const markets = await Promise.all(
    rawMarkets.map(async (item) => {
      const { tkn0, tkn1, tickSpacing } = item;

      // Fetch token information for both tokens (tkn0 and tkn1)
      const tokenInfos = await getAction(
        client,
        multicall,
        "multicall"
      )({
        contracts: [
          {
            functionName: "decimals",
            abi: [
              {
                name: "decimals",
                outputs: [
                  {
                    type: "uint8",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            address: tkn0,
          },
          {
            functionName: "symbol",
            abi: [
              {
                name: "symbol",
                outputs: [
                  {
                    type: "string",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            address: tkn0,
          },
          {
            functionName: "decimals",
            abi: [
              {
                name: "decimals",
                outputs: [
                  {
                    type: "uint8",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            address: tkn1,
          },
          {
            functionName: "symbol",
            abi: [
              {
                name: "symbol",
                outputs: [
                  {
                    type: "string",
                  },
                ],
                stateMutability: "view",
                type: "function",
              },
            ],
            address: tkn1,
          },
        ],
        allowFailure: false,
      });

      return {
        tkn0: buildToken({
          address: tkn0,
          symbol: tokenInfos[1] as string, // Symbol for tkn0
          displayDecimals: tokenInfos[0] as number,
          priceDisplayDecimals: tokenInfos[0] as number, // Decimals for tkn0
          mgvTestToken: false,
        }) as Token,
        tkn1: buildToken({
          address: tkn1,
          symbol: tokenInfos[3] as string, // Symbol for tkn1
          displayDecimals: tokenInfos[2] as number,
          priceDisplayDecimals: tokenInfos[2] as number, // Decimals for tkn1
          mgvTestToken: false,
        }) as Token,
        tickSpacing,
      };
    })
  );

  const marketsConfig = rawMarketsConfigs?.map((item) => {
    const { config01, config10 } = item;

    return {
      config01: {
        ...config01,
        density: Number(config01.rawDensity),
        offer_gasbase: config01.kilo_offer_gasbase,
      } as LocalConfig,
      config10: {
        ...config10,
        density: Number(config10.rawDensity),
        offer_gasbase: config10.kilo_offer_gasbase,
      } as LocalConfig,
    };
  });

  return { markets, marketsConfig };
}
