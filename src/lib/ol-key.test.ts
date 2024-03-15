import { describe, expect, it } from 'vitest'
import type { OLKey } from '../types/lib.js'
import { flip } from './ol-key.js'

describe('flip', () => {
  it('flips the OLKey', () => {
    const olKey: OLKey = {
      outbound_tkn: '0x1',
      inbound_tkn: '0x2',
      tickSpacing: 100n,
    }
    const flipped = flip(olKey)
    expect(flipped).toEqual({
      outbound_tkn: '0x2',
      inbound_tkn: '0x1',
      tickSpacing: 100n,
    })
  })
})
