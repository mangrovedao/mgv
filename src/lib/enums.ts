/**
 * The buy or sell side of an order.
 * @param buy The buy side.
 * @param sell The sell side.
 */
export enum BS {
  buy = 'buy',
  sell = 'sell',
}

/**
 * The bids or asks side of the order book.
 * @param asks The asks side.
 * @param bids The bids side.
 */
export enum BA {
  asks = 'asks',
  bids = 'bids',
}

/**
 * The order type.
 * @param GTC Good till canceled. If the order is partially filled, the remaining part of the order remains in the order book.
 * If an expiry date is specified, the order will be canceled at the specified date (GTD).
 * @param GTCE Good till canceled enforced. This is similar to GTC, but if the order fails to post the remaining part of the order, the tx will revert.
 * @param PO Post only. The order will not go trhough a market ordeer.
 * @param IOC Immediate or cancel. This will only run through the market order at the given limit price.
 * @param FOK Fill or kill. This will only run through the market order at the given limit price. If the order is not filled, it will be canceled
 */
export enum Order {
  GTC = 0,
  GTCE = 1,
  PO = 2,
  IOC = 3,
  FOK = 4,
}
