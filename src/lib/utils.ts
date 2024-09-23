import type {
  MarketParams,
  OLKey,
  SerializableMarketParams,
  SerializableOLKey,
} from '../types/index.js'

export function mask(n: bigint): bigint {
  return (1n << n) - 1n
}

export function toSerializable<
  TType extends MarketParams | OLKey = MarketParams | OLKey,
>(
  args: TType,
): TType extends MarketParams ? SerializableMarketParams : SerializableOLKey {
  return {
    ...args,
    tickSpacing: Number(args.tickSpacing),
  } as unknown as TType extends MarketParams
    ? SerializableMarketParams
    : SerializableOLKey
}

export function fromSerializable<
  TType extends SerializableMarketParams | SerializableOLKey =
    | SerializableMarketParams
    | SerializableOLKey,
>(args: TType): TType extends SerializableMarketParams ? MarketParams : OLKey {
  return {
    ...args,
    tickSpacing: BigInt(args.tickSpacing),
  } as unknown as TType extends SerializableMarketParams ? MarketParams : OLKey
}
