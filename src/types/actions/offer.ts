import type { SimulateContractReturnType } from 'viem'
import type { newOfferByTickABI } from '../../builder/offer/new.js'
import type { retractOfferABI } from '../../builder/offer/remove.js'
import type { updateOfferByTickABI } from '../../builder/offer/update.js'

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
