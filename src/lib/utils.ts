export function getMaskFromBits(bits: bigint): bigint {
  return (1n << bits) - 1n
}

export function decodeBigintsFromBigint<TInput extends readonly bigint[]>(
  config: bigint,
  bitSizes: TInput,
): TInput {
  let currentBit = 0n
  return bitSizes.map((bitSize) => {
    const mask = getMaskFromBits(bitSize)
    const value = (config >> currentBit) & mask 
    currentBit += bitSize
    return value
  }) as unknown as TInput
}
