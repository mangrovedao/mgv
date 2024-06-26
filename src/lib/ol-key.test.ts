import { describe, expect, it } from 'vitest'
import type { OLKey } from '../types/lib.js'
import { flip, hash } from './ol-key.js'

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

  it('hashes the olKey', () => {
    const markets = [
      {
        id: '0x456cb2ca75d08a5c881c4b083a6dd4a469f35d14bd7f2279e8ea8141378ad840',
        outbound_tkn: '0x999f220296b5843b2909cc5f8b4204aaca5341d8',
        inbound_tkn: '0x4300000000000000000000000000000000000004',
        tickSpacing: 1n,
      },
      {
        id: '0x8c421ef7d31aa292802bc4360219b78a45e38a40cc76d04f3f0a9fbc914cbd79',
        outbound_tkn: '0x4300000000000000000000000000000000000003',
        inbound_tkn: '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34',
        tickSpacing: 1n,
      },
      {
        id: '0x9478fa0733344acd896e7f5ffa9ee03ccab653020a2898458323ddd6b53593df',
        outbound_tkn: '0x4300000000000000000000000000000000000003',
        inbound_tkn: '0x4300000000000000000000000000000000000004',
        tickSpacing: 1n,
      },
      {
        id: '0x9646f837c173ebace85f4331500010baada3c402b39fe0b42cb6a981ae4c86d0',
        outbound_tkn: '0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34',
        inbound_tkn: '0x4300000000000000000000000000000000000003',
        tickSpacing: 1n,
      },
      {
        id: '0x970524a7911bd72feac6c2e9065d469de667eeb53c26dd876351b6c9eaea9a30',
        outbound_tkn: '0x9a50953716ba58e3d6719ea5c437452ac578705f',
        inbound_tkn: '0x4300000000000000000000000000000000000004',
        tickSpacing: 1n,
      },
      {
        id: '0xa0d8dad9aa31ad878a583f223811d7a37f06a6f2eefaf72f6b60ef43419f9cdd',
        outbound_tkn: '0x4300000000000000000000000000000000000004',
        inbound_tkn: '0x4300000000000000000000000000000000000003',
        tickSpacing: 1n,
      },
      {
        id: '0xa1dbe0263a07f9407dbe0f2b0ccfae710ce701cca7bfba9fe42227998e859403',
        outbound_tkn: '0x4300000000000000000000000000000000000004',
        inbound_tkn: '0x9a50953716ba58e3d6719ea5c437452ac578705f',
        tickSpacing: 1n,
      },
      {
        id: '0xdff65bb4101d518f43ad16acfea56d37bce9a65b8ecc0de94a3e238f68a3516d',
        outbound_tkn: '0x4300000000000000000000000000000000000004',
        inbound_tkn: '0x999f220296b5843b2909cc5f8b4204aaca5341d8',
        tickSpacing: 1n,
      },
    ] as const

    for (const market of markets) {
      expect(hash(market)).toEqual(market.id)
    }
  })
})
