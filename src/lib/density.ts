export function parseDensity(rawDensity: bigint): number {
  // Extract the mantissa and exponent
  const mantissa = Number(rawDensity & 0b11n) // Last 2 bits
  const exponent = Number((rawDensity >> 2n) & 0b1111111n) // Next 7 bits

  // Convert based on the encoding rules
  let density: number
  if (exponent === 0 || exponent === 1) {
    // If exponent is 0 or 1, density calculation
    density = mantissa * 2 ** -32
  } else {
    // Otherwise, density calculation
    density = (1 + mantissa / 4) * 2 ** (exponent - 32)
  }

  return density
}

export function multiplyDensity(density: number, b: bigint, up = true): bigint {
  const roundMethod = up ? Math.ceil : Math.round
  return BigInt(roundMethod(Number(b) * density))
}
