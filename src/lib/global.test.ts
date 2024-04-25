import { describe, expect, it } from 'vitest'
import type { GlobalConfig } from '~mgv/types/lib.js'
import { unpackGlobalConfig } from './global.js'

describe('global', () => {
  it('should be tested', () => {
    const globalUnpacked: GlobalConfig = {
      monitor: '0x815872019C3a84c8BeFC2d0Bd0d1304D10D57f62',
      useOracle: false,
      notify: false,
      gasprice: 5n,
      gasmax: 2000000n,
      dead: false,
      maxRecursionDepth: 75n,
      maxGasreqForFailingOffers: 6000000n,
    }

    const globalPacked =
      58504626851438133404885762180742271327216363016851512611286858845941858593792n

    const global = unpackGlobalConfig(globalPacked)
    expect(global).toEqual(globalUnpacked)
  })
})
