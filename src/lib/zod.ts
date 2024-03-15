import { type Address, type Hex, getAddress, isAddress, isHex } from 'viem'
import * as z from 'zod'
import { isSafeVolume, tickInRange } from './tick.js'

export const tickSchema = z
  .bigint()
  .refine((v) => tickInRange(v), 'tick is not in range')

export const hexSchema = z.custom<Hex>((v) => isHex(v))

export const addressSchema = z
  .custom<Address>(
    (v) => typeof v === 'string' && isAddress(v),
    'invalid address',
  )
  .transform((v) => getAddress(v))

export const volumeSchema = z
  .bigint()
  .refine((v) => isSafeVolume(v), 'volume is not safe')

export const olKeySchema = z.object({
  outbound_tkn: addressSchema,
  inbound_tkn: addressSchema,
  tickSpacing: z
    .bigint()
    .positive('tickSpacing is not positive')
    .refine((v) => tickInRange(v), 'tickSpacing is not in range'),
})
