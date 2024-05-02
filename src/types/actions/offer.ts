import type { SimulateContractReturnType } from 'viem'
import type { newOfferByTickABI } from '../../builder/new-offer.js'
import type { updateOfferByTickABI } from '../../builder/offer/update.js'
import type { retractOfferABI } from '../../builder/offer/remove.js'

export type NewOfferResult = {
  offerId: bigint
  request: SimulateContractReturnType<
    typeof newOfferByTickABI,
    'newOfferByTick'
  >['request']
}

export type UpdateOfferResult = {
  request: SimulateContractReturnType<
    typeof updateOfferByTickABI,
    'updateOfferByTick'
  >['request']
}

export type RetractOfferResult = {
  provision: bigint
  request: SimulateContractReturnType<
    typeof retractOfferABI,
    'retractOffer'
  >['request']
}
