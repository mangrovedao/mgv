import { describe, expect, it } from 'vitest'
import { mask } from './utils.js'

describe('utils', () => {
  it('create masks', () => {
    expect(mask(1n).toString(2)).toEqual('1')
    expect(mask(2n).toString(2)).toEqual('11')
    expect(mask(3n).toString(2)).toEqual('111')
    expect(mask(4n).toString(2)).toEqual('1111')
  })
})
