import { tickFromPrice } from "./tick.js";

/**
 * Parameters for converting a human readable price to a tick value
 * @param price the human readable price
 * @param inboundDecimals the inbound decimals
 * @param outboundDecimals the outbound decimals
 */
export type HumanPriceToTickParams = {
  price: number;
  inboundDecimals: number;
  outboundDecimals: number;
};

/**
 * Converts a human readable price to a tick value
 * @param param the human readable price with inbound and outbound decimals
 * @returns the tick value
 */
export function humanPriceToTick({
  price,
  inboundDecimals,
  outboundDecimals,
}: HumanPriceToTickParams) {
  // price is inbound / outbound
  // this means that if inboundDecimals is 18 and outboundDecimals is 6, and the price is 1.4
  // then the price is 1.4 * 10^12
  const adjustedPrice = price * 10 ** (inboundDecimals - outboundDecimals);
  return tickFromPrice(adjustedPrice);
}
