import { describe, expect, it } from 'vitest'
import type { LocalConfig } from '~mgv/types/lib.js'
import { parseDensity } from './density.js'
import { unpackLocalConfig } from './local.js'

describe('local', () => {
  it('should unpack', () => {
    const localUnpacked: LocalConfig = {
      active: true,
      fee: 2n,
      density: parseDensity(273n),
      binPosInLeaf: 1n,
      level3: 11529215046068469760n,
      level2: 17870283321406128128n,
      level1: 48n,
      root: 2n,
      offer_gasbase: 300_000n,
      rawDensity: 273n,
      lock: false,
      last: 8698n,
    }
    const packed =
      58469124224817505385311355821850761387076597147436894115161179890893849633274n

    const local = unpackLocalConfig(packed)
    expect(local).toEqual(localUnpacked)
  })
})
