import type { SimulateContractReturnType } from 'viem'
import type { LocalConfig, Token } from '~mgv/_types/index.js'
import type { openMarketsABI } from '~mgv/builder/open-markets.js'

export type OpenMarketsResult = {
  markets: {
    tkn0: Token
    tkn1: Token
    tickSpacing: bigint
  }[]
  marketsConfig: { config01: LocalConfig; config10: LocalConfig }[]
  // request: SimulateContractReturnType<
  //   typeof openMarketsABI,
  //   "openMarkets"
  // >["request"];
}
