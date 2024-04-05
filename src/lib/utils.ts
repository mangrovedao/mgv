export function mask(n: bigint): bigint {
  return (1n << n) - 1n
}