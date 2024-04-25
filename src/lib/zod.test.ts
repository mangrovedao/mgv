import { zeroAddress } from 'viem'
import { describe, expect, it } from 'vitest'
import { MAX_SAFE_VOLUME, MAX_TICK } from './tick.js'
import { hexSchema, olKeySchema, tickSchema, volumeSchema } from './zod.js'

describe('zod', () => {
  describe('tick', () => {
    it('parsing', () => {
      const tick = 100n
      const parsed = tickSchema.parse(tick)
      expect(parsed).toEqual(tick)
    })

    it('errors', () => {
      const tick = MAX_TICK + 1n
      expect(() => tickSchema.parse(tick)).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "tick is not in range",
            "path": []
          }
        ]]  
      `)
    })
  })

  describe('hex', () => {
    it('parsing', () => {
      const hex = '0x123'
      const parsed = hexSchema.parse(hex)
      expect(parsed).toEqual(hex)
    })

    it('errors', () => {
      const hex = '123'
      expect(() => hexSchema.parse(hex)).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "fatal": true,
            "path": [],
            "message": "Invalid input"
          }
        ]]  
      `)
    })
  })

  describe('volume', () => {
    it('parsing', () => {
      const volume = 100n
      const parsed = volumeSchema.parse(volume)
      expect(parsed).toEqual(volume)
    })

    it('errors', () => {
      const volume = -1n
      expect(() =>
        volumeSchema.parse(volume),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "volume is not safe",
            "path": []
          }
        ]]  
      `)
      const volume2 = MAX_SAFE_VOLUME + 1n
      expect(() =>
        volumeSchema.parse(volume2),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "volume is not safe",
            "path": []
          }
        ]]  
      `)
    })
  })

  describe('address', () => {
    it('parsing', () => {
      const address = zeroAddress
      const parsed = hexSchema.parse(address)
      expect(parsed).toEqual(address)
    })

    it('errors', () => {
      const address = '123'
      expect(() =>
        hexSchema.parse(address),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "fatal": true,
            "path": [],
            "message": "Invalid input"
          }
        ]]  
      `)
    })
  })

  describe('olKey', () => {
    it('parsing', () => {
      const olKey = {
        outbound_tkn: zeroAddress,
        inbound_tkn: zeroAddress,
        tickSpacing: 100n,
      }
      const parsed = olKeySchema.parse(olKey)
      expect(parsed).toEqual(olKey)
    })

    it('errors', () => {
      const olKey = {
        outbound_tkn: '123',
        inbound_tkn: zeroAddress,
        tickSpacing: 100n,
      }
      expect(() =>
        olKeySchema.parse(olKey),
      ).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "invalid address",
            "fatal": true,
            "path": [
              "outbound_tkn"
            ]
          }
        ]]  
      `)
    })
  })
})
