import type { BA } from "./enums.js";
import { inboundFromOutbound, outboundFromInbound } from "./tick.js";
import { formatUnits } from "viem";

// if ask, then outbound is the base, inbound is the quote
// if bid, then outbound is the quote, inbound is the base

export function rpcOfferToHumanOffer({
  ba,
  gives,
  tick,
  baseDecimals,
  quoteDecimals,
}: {
  gives: bigint;
  tick: bigint;
  ba: BA;
  baseDecimals: number;
  quoteDecimals: number;
}) {
  if (ba === "asks") {
    const volume = Number(formatUnits(gives, baseDecimals));
    const total = Number(formatUnits(inboundFromOutbound(tick, gives), quoteDecimals));
    const price = total / volume;
    return {
      volume,
      total,
      price,
      ba,
    };
  }
  const total = Number(formatUnits(gives, quoteDecimals));
  const volume = Number(formatUnits(outboundFromInbound(tick, gives), baseDecimals));
  const price = total / volume;
  return {
    volume,
    total,
    price,
    ba,
  };
}
