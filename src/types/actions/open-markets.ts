import type { LocalConfig, Token } from '~mgv/_types/index.js'

export type OpenMarketsResult = {
  markets: {
    tkn0: Token
    tkn1: Token
    tickSpacing: bigint
  }[]
  marketsConfig: { config01: LocalConfig; config10: LocalConfig }[]
}
