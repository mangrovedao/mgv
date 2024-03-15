import { describe, expect, it } from "vitest";
import { decodeBigintsFromBigint } from "./utils.js";

describe('utils', () => {
  it('extract bigints', () => {
    const raw = 0b1_10_100n;
    //            c b  a
    const [a, b, c] = decodeBigintsFromBigint(raw, [3n, 2n, 1n]);
    expect(a).toEqual(0b100n);
    expect(b).toEqual(0b10n);
    expect(c).toEqual(0b1n);
  })
})