import type { Client, SimulateContractParameters } from 'viem'
import { simulateContract } from 'viem/actions'
import {
  type RawRetractOfferParams,
  type RetractOfferParams,
  rawRetractOfferParams,
  type retractOfferABI,
  retractOfferParams,
} from '../../builder/offer/remove.js'
import type {
  BuiltArgs,
  MangroveActionsDefaultParams,
  MarketParams,
} from '../../types/actions/index.js'
import type { RetractOfferResult } from '../../types/actions/offer.js'
import type { Prettify } from '../../types/lib.js'
import { getAction } from '../../utils/getAction.js'

type SimulationParams = SimulateContractParameters<
  typeof retractOfferABI,
  'retractOffer'
>

export type SimulateRawRetractOfferArgs = Prettify<
  RawRetractOfferParams & Omit<SimulationParams, BuiltArgs>
>

export async function simulateRawRetractOffer(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  args: SimulateRawRetractOfferArgs,
): Promise<RetractOfferResult> {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...rawRetractOfferParams(args),
  })
  return { provision: result, request }
}

export type SimulateRetractOfferArgs = Prettify<
  RetractOfferParams & Omit<SimulationParams, BuiltArgs>
>

export async function simulateRetractOffer(
  client: Client,
  actionParams: MangroveActionsDefaultParams,
  market: MarketParams,
  args: SimulateRetractOfferArgs,
): Promise<RetractOfferResult> {
  const { request, result } = await getAction(
    client,
    simulateContract,
    'simulateContract',
  )({
    ...(args as unknown as SimulationParams),
    address: actionParams.mgv,
    ...retractOfferParams(market, args),
  })
  return { provision: result, request }
}
