# @mangrovedao/mgv

## 0.8.17

### Patch Changes

- c6ee852: Add Blast token and Blast market

## 0.8.16

### Patch Changes

- 9c61618: Change the decimals displayed for the Usd currencies

## 0.8.15

### Patch Changes

- e08f617: Added total provision to kandel view function

## 0.8.14

### Patch Changes

- 828b863: Add reverse market possibility on kandel view function

## 0.8.13

### Patch Changes

- 1c2e49e: Extracted markets from the array
- 8375fd9: Remove zod from mgv

## 0.8.12

### Patch Changes

- 918a274: rename retractParams (from,to) args

## 0.8.11

### Patch Changes

- adcb4b6: Add USDe token on blast

## 0.8.10

### Patch Changes

- 1e72268: Export types for `getKandelState`

## 0.8.9

### Patch Changes

- a5219bc: Fix density by using the same algorithm as from the chain

## 0.8.8

### Patch Changes

- 22689cf: Add flag for mgv test tokens

## 0.8.7

### Patch Changes

- 12f7da7: Added Base sepolia smart kandel

## 0.8.6

### Patch Changes

- 54a59ad: Add sepolia market WBTC/DAI

## 0.8.5

### Patch Changes

- 90827c9: Fixed values for populate

## 0.8.4

### Patch Changes

- 6766134: Add export for `getKandelGasreq`

## 0.8.3

### Patch Changes

- ccf2f05: Fix kandel division by 0

## 0.8.2

### Patch Changes

- 48d97b5: Add addresses for base sepolia

## 0.8.1

### Patch Changes

- b33b7e0: Added `getOrder` and `getOrders`

## 0.8.0

### Minor Changes

- a459e3a: Added the smart router client

  The `getUserRouter` functions were moved from the order subfolders to `smart-router.ts` files

  Please enter a summary for your changes.

- a459e3a: Added addresses to the default context

## 0.7.1

### Patch Changes

- 429e847: Change params to market order simulation

## 0.7.0

### Minor Changes

- 8738527: Changes kandel client to receive action params
- 8738527: Changes getSemiBookOlKeys to get market params

### Patch Changes

- d58a776: Viem to min version
- a43177d: Update viem to lts
- 8738527: Added provisions and offer id to kandel view

## 0.6.14

### Patch Changes

- cd00ded: Fix simulation types for account
- cd00ded: Change price naming to raw price in simulation
- cd00ded: Fix market order return type

## 0.6.13

### Patch Changes

- 68de50e: Add stricter typescript rules

## 0.6.12

### Patch Changes

- 1a54eab: Add wait for result on orders

## 0.6.11

### Patch Changes

- fe28644: Add result from logs on update, and remove

## 0.6.10

### Patch Changes

- cbbc841: Fixed limit order wrong address

## 0.6.9

### Patch Changes

- 185dadb: Add default gasreq to kandel

## 0.6.8

### Patch Changes

- abaea74: Add SmartKandel address from blast

## 0.6.7

### Patch Changes

- dc6879f: Add getKandelSteps without kandel client

## 0.6.6

### Patch Changes

- 8fba08b: Added list of tokens export (blast)

## 0.6.5

### Patch Changes

- 18aaff5: Fix loop for balances

## 0.6.4

### Patch Changes

- 637a4a9: Fix payable not valid ABI

## 0.6.3

### Patch Changes

- 1d2a6a9: Fixed Params not valid ABI type

## 0.6.2

### Patch Changes

- 54bebda: Fix tick in ABI

## 0.6.1

### Patch Changes

- edd73fd: Fix the tick not being an ABI type

## 0.6.0

### Minor Changes

- a93d1aa: Add kandel to the SDK

## 0.5.2

### Patch Changes

- 94fdc5d: Add orderLabel function to lib to get the label of an order

## 0.5.1

### Patch Changes

- 9f28bcb: Added logic inside of the overlying in `GetBalanceResult`

## 0.5.0

### Minor Changes

- b7eeffd: Add gasreq defaults and to logics

### Patch Changes

- b7eeffd: Added exports for logic

## 0.4.0

### Minor Changes

- 0ea39e9: Added general actions for balances and logic
- 0ea39e9: Add human readable prices conversions

### Patch Changes

- 0ea39e9: Added tickSpacing to tick lib

## 0.3.0

### Minor Changes

- 0fc1b02: Added routing logics
  Added midPrice and spread calculation to getBook

## 0.2.2

### Patch Changes

- 4266fe3: change price display

## 0.2.1

### Patch Changes

- 193d75a: Fix USDB address on blast

## 0.2.0

### Minor Changes

- 83f23ab: Added addresses book in /addresses

## 0.1.2

### Patch Changes

- 485538b: Fix price on bids

## 0.1.1

### Patch Changes

- a0eb0a9: Fixed negative tick calculation

## 0.1.0

### Minor Changes

- bc7226c: - Added accessor for all functions and utils at different levels
  - Added functions to cancel and update limit orders
  - Added logs parser to get market order result
- b0185a7: Added limit order result from logs

## 0.0.3

### Patch Changes

- c9f8d87: Fixing CI
- 7d9509d: Adding CI pipeline

## 0.0.2

### Patch Changes

- Adding changeset and initial release
