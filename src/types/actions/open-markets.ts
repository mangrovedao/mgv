import type { Address, SimulateContractReturnType } from 'viem'
import type { LocalConfig } from '~mgv/_types/index.js'
import type { openMarketsABI } from '~mgv/builder/open-markets.js'

// [ [0x4300000000000000000000000000000000000003,0x4300000000000000000000000000000000000004,1], ... ]
// [ [true,2,320,2,1125899906842624,134,576460752303423488,1,300,false,58172,true,2,273,1,274878955520,13835058055282163712,16,2,300,false,56246], ... ]


export type OpenMarketsResult = {
    markets: {
        tkn0: Address,
        tkn1: Address,
        tickSpacing: bigint
    }[]
    marketsConfig: {config01: LocalConfig, config10: LocalConfig}[]
    request: SimulateContractReturnType<
    typeof openMarketsABI,
    'openMarkets'
  >['request']
}
