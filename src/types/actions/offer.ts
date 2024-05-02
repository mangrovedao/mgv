import type { SimulateContractReturnType } from 'viem'
import type { newOfferByTickABI } from '../../builder/new-offer.js'
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
