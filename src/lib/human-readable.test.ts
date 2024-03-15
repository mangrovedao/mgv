import { describe, expect, it } from "vitest";
import { humanPriceToTick } from "./human-readable.js";
import { tickFromPrice } from "./tick.js";

describe('human-readable', () => {

  it('correct price to tick', () => {
    const USDC_DECIMALS = 6;
    const WETH_DECIMALS = 18;
    const humanPrice = 3600;

    const tickExpected = humanPriceToTick({
      price: humanPrice,
      inboundDecimals: WETH_DECIMALS,
      outboundDecimals: USDC_DECIMALS,
    });

    const fromPrice = tickFromPrice(humanPrice * 10 ** (WETH_DECIMALS - USDC_DECIMALS));

    expect(tickExpected).toEqual(fromPrice);
  });
})