import type { Address } from 'viem'

export const DEFAULT_DISPLAY_DECIMALS = 3 as const
export const DEFAULT_PRICE_DISPLAY_DECIMALS = 6 as const
export const DEFAULT_DECIMALS = 18 as const

export type Token<
  TAddress extends Address = Address,
  TSymbol extends string = string,
  TDecimals extends number = number,
  TDisplayDecimals extends number = number,
  TPriceDisplayDecimals extends number = number,
> = {
  address: TAddress
  symbol: TSymbol
  decimals: TDecimals
  displayDecimals: TDisplayDecimals
  priceDisplayDecimals: TPriceDisplayDecimals
}

export type BuildTokenParms<
  TAddress extends Address = Address,
  TSymbol extends string = string,
  TDecimals extends number | undefined = number | undefined,
  TDisplayDecimals extends number | undefined = number | undefined,
  TPriceDisplayDecimals extends number | undefined = number | undefined,
> = {
  address: TAddress
  symbol: TSymbol
  decimals?: TDecimals
  displayDecimals?: TDisplayDecimals
  priceDisplayDecimals?: TPriceDisplayDecimals
}

export function buildToken<
  TAddress extends Address = Address,
  TSymbol extends string = string,
  TDecimals extends number | undefined = undefined,
  TDisplayDecimals extends number | undefined = undefined,
  TPriceDisplayDecimals extends number | undefined = undefined,
>({
  address,
  symbol,
  decimals = DEFAULT_DECIMALS,
  displayDecimals = DEFAULT_DISPLAY_DECIMALS,
  priceDisplayDecimals = DEFAULT_PRICE_DISPLAY_DECIMALS,
}: BuildTokenParms<
  TAddress,
  TSymbol,
  TDecimals,
  TDisplayDecimals,
  TPriceDisplayDecimals
>): Token<
  TAddress,
  TSymbol,
  TDecimals extends number ? TDecimals : typeof DEFAULT_DECIMALS,
  TDisplayDecimals extends number
    ? TDisplayDecimals
    : typeof DEFAULT_DISPLAY_DECIMALS,
  TPriceDisplayDecimals extends number
    ? TPriceDisplayDecimals
    : typeof DEFAULT_PRICE_DISPLAY_DECIMALS
> {
  return {
    address,
    symbol,
    decimals,
    displayDecimals,
    priceDisplayDecimals,
  } as Token<
    TAddress,
    TSymbol,
    TDecimals extends number ? TDecimals : typeof DEFAULT_DECIMALS,
    TDisplayDecimals extends number
      ? TDisplayDecimals
      : typeof DEFAULT_DISPLAY_DECIMALS,
    TPriceDisplayDecimals extends number
      ? TPriceDisplayDecimals
      : typeof DEFAULT_PRICE_DISPLAY_DECIMALS
  >
}
