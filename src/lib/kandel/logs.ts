import {
  type Address,
  type Hex,
  type Log,
  parseAbi,
  parseEventLogs,
} from 'viem'

export const seederEventsABI = parseAbi([
  'event NewSmartKandel(address indexed owner, bytes32 indexed baseQuoteOlKeyHash, bytes32 indexed quoteBaseOlKeyHash, address kandel)',
  'event NewKandel(address indexed owner, bytes32 indexed baseQuoteOlKeyHash, bytes32 indexed quoteBaseOlKeyHash, address kandel)',
])

export type KandelFromLogsResult = {
  address: Address
  type: 'SmartKandel' | 'Kandel'
  owner: Address
  baseQuoteOlKeyHash: Hex
}[]

export function getKandelsFromLogs(logs: Log[]) {
  const events = parseEventLogs({
    logs,
    abi: seederEventsABI,
    eventName: ['NewKandel', 'NewSmartKandel'],
  })
  const kandels = [] as KandelFromLogsResult

  for (const event of events) {
    kandels.push({
      address: event.address,
      type: event.eventName === 'NewSmartKandel' ? 'SmartKandel' : 'Kandel',
      owner: event.args.owner,
      baseQuoteOlKeyHash: event.args.baseQuoteOlKeyHash,
    })
  }

  return kandels
}
