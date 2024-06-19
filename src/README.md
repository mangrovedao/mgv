# mgv

mgv is an sdk aimed at providing a simple way to interact with Mangrove.

## General context

There are some general contexts that needs to be set

### Addresses

The addresses needed to run view functions, market, and limit orders are gotten from the type

```ts
// This is the type that holds mgv, mgvOrder, and mgvReader
import type { MangroveActionsDefaultParams } from "@mangrovedao/mgv";

const mangroveParams: MangroveActionsDefaultParams = {
  mgv: "0x...", // mangrove core contract
  mgvOrder: "0x...", // mangrove order contract
  mgvReader: "0x...", // mangrove reader contract
}
```

Then we can also define tokens with helper functions like this

```ts
import { buildToken } from "@mangrovedao/mgv";

export const WETH = buildToken({
  address: '0x...',
  symbol: 'WETH',
})
```

Then we can define a market this way:

```ts
import type { MarketParams } from "@mangrovedao/mgv";

const WETH = buildToken({...})
const USDC = buildToken({...})

const marketParams: MarketParams = {
  base: WETH,
  quote: USDC,
  tickSpacing: 1n, // market tick spacing
}
```

Predefined tokens and addresses are available in the `@mangrovedao/mgv` package.

```ts
import { blastMangrove, blastWETH, blastUSDB, blastMarkets } from "@mangrovedao/mgv/addresses";
```

### logics

The logics are hooks that can be attached to orders. An aave forke logic (sourcing from and to an aave fork) can be defined like this for example:

```ts
import { buildLogic, aaveBalance, aaveOverLying } from "@mangrovedao/mgv/addresses";

const aaveForkLogic = buildLogic(
  "aaveFork",
  '0x...', // aave fork logic address
  1_300_000n, // gas required to run the logic
  aaveOverLying, // the overlying logic
  aaveBalance, // the balance logic
)
```

Some logics are predefined in the `@mangrovedao/mgv` package.

```ts
import { blastLogics } from "@mangrovedao/mgv/addresses";
```

### Market client

The market client is a viem extension of the client object that interacts with the designated market. Given a defined market, we create and interacts with the market client like this:

```ts
import { createClient } from "viem";
import { publicMarketActions } from "@mangrovedao/mgv";

const marketClient = createClient({...})
  .extend(publicMarketActions(mangroveParams, market))

// getting the book, and configs for the given market
// This gives it at the latest block
const book = await marketClient.getBook({ depth: 100 });
```

### General client

the general client can be initiated without any context and can be used like this:

```ts
import { createClient } from "viem";
import { generalActions } from "@mangrovedao/mgv";
import { blastMarkets, blastLogics } from "@mangrovedao/mgv/addresses";

const client = createClient()
  .extend(generalActions)

const {tokens, overlying, logicBalances} = await client.getBalances({
  markets: blastMarkets,
  logics: blastLogics,
  user: '0x...',
})
```

this function is actually returning all tokens from the market alongside the balance of the user, all overlying tokens according to the logics alongside a flag that indicates if the logic is available for a given token, and finally logicBalances that gives all balances of tokens according to logics.

Here are a few helper function that could be used to interact with the client:

```ts
const {tokens, overlying, logicBalances} = await client.getBalances({
  markets: blastMarkets,
  logics: blastLogics,
  user: '0x...',
})

function availableLogics(token: Token): Logic[] {
  return overlying.filter((overlying) => overlying.available)
}

function getBalance(token: Token, logic?: Logic | undefined): bigint {
  if (logic) {
    return logicBalances.find(lb => {
      return isAddressEqual(lb.token.address, token.address) && isAddressEqual(lb.logic.logic, logic.logic)
    })?.balance ?? 0n
  }
  return tokens.find(t => isAddressEqual(t.address, token.address))?.balance ?? 0n
}
```

### Mangrove client

The mangrove client is a view extension of the client object that interacts with the mangrove contracts. It can be initiated like this:

```ts
import { createClient } from "viem";
import { magroveActions } from "@mangrovedao/mgv";

const mangroveClient = createClient({...})
  .extend(mangroveActions(mangroveParams))

// retrieves the user router
const router = await mangroveClient.getUserRouter({
  user: '0x...'
})
```

## Making a market order

To make a market order, there are 4 steps to follow:

- Make a market order simulation against the current book to get the estimated price, slippage, fees, ...
- Get the needed steps for making a market order
- Execute the market order
- Parse the logs to get the real result of the market order

### Making a market order simulation

To make a market order simulation, we need to get the book and the order parameters. The book can be retrieved on the spot or can be retrieved from a global context pinging the blockchain to get the latest book. All amounts are to be converted to wei. It can be done with `parseUnits(amount, decimals)` exported from `viem`.

```ts
import { book } from "./book.ts";
import { marketOrderSimulation, BS } from "@mangrovedao/mgv";

// simulate buying 1 unit of the base token
const {
  baseAmount,
  quoteAmount,
  gas,
  feePaid,
  maxTickEncountered,
  minSlippage,
  fillWants,
  price,
} = marketOrderSimulation({
  book,
  bs: BS.buy,
  base: parseUnits('1', market.base.decimals),
})
```

important values that it returns are baseAmount and quoteAmount that can then be used to modify the inputs. We can then use the remaining parameters to then place the market order after.

### Getting the needed steps for making a market order

On the market client, we can get the needed steps for making a market order like this:

```ts
import { marketClient } from "./marketClient.ts";

const [approvalStep] = await marketClient.getMarketOrderSteps({
  bs: BS.buy,
  user: '0x...',
  sendAmount: quoteAmount, // this can be ignored
})

if (!approvalStep.done) {
  // doing the approval according the approvalStep params
}
```

### Executing the market order

To execute the market order, we can use the `simulate` function from the market client, this sends back a request that can be used to sign and broadcast the transaction (assuming all the steps from getMarketOrderSteps are done).

```ts
const {
  takerGot,
  takerGave,
  bounty,
  feePaid,
  request
} = await marketClient.simulateMarketOrderByVolumeAndMarket({
  baseAmount: parseEther('1'),
  quoteAmount: parseEther('3000'),
  bs: BS.buy,
  slippage: 0.05, // 5% slippage
  account: '0x...'
})

const tx = await walletClient.writeContract(request)
```

### Parsing the logs

Once the transaction has been broadcasted, we can wait for the transaction receipt and pass the logs to a utils function to convert the logs of the market order to a more readable format.

```ts
import { marketOrderResultFromLogs } from "@mangrovedao/mgv";

const tx = await walletClient.writeContract(request)

const receipt = await publicClient.waitForTransactionReceipt({
  hash: tx
})

const {
  takerGot,
  takerGave,
  feePaid,
  bounty,
} = marketOrderResultFromLogs(
  actionParams,
  market,
  {
    logs: receipt.logs,
    bs: BS.buy,
    taker: '0x...'
  }
)
```

## Making a limit order

To make a limit order, there are 4 steps to follow:
- Getting the user router
- Get the needed steps for making a limit order
- Execute the limit order
- Parse the logs to get the real result of the limit order

### Getting the user router

To get the user router, we can use the mangrove client like this:

```ts
import { mangroveClient } from "./mangroveClient.ts";

// this value is deterministic
// it can be cached via tanstack query for example
const userRouter = await mangroveClient.getUserRouter({
  user: '0x...'
})
```

### Getting the needed steps for making a limit order

We need to get the steps for making a limit order. This will return a size 1 array with the first element being the approval step if needed.

```ts
const steps = await marketClient.getLimitOrderSteps({
  bs: BS.buy,
  user: '0x...',
  userRouter,
})
```

if there is a logic attached the the limit order we want to do, we have to pass the token address of the overlying token we will send. For example if we buy WETH with USDC, and use AAVE as logic, we have to pass the address of aUSDC.

```ts
const steps = await marketClient.getLimitOrderSteps({
  bs: BS.buy,
  user: '0x...',
  userRouter,
  logicToken: '0x...'
})
```

### Executing the limit order

To execute the limit order, we can use the `simulate` function from the market client, this sends back a request that can be used to sign and broadcast the transaction (assuming all the steps from getLimitOrderSteps are done).

```ts
const {
  request
} = await marketClient.simulateLimitOrder({
  baseAmount: parseEther('1'),
  quoteAmount: parseEther('3000'),
  bs: BS.buy,
  book: book,
  orderType: Order.GTC,
  // If expiry date is ignored, then it will not expire
  expiryDate: Date.now() / 1000 + 60 * 60, // 1 hour
  // logics can be left to undefined (meaning no logic)
  takerGivesLogic: blastOrbitLogic.logic,
  takerWantsLogic: blastPacFinanceLogic.logic,
})

const tx = await walletClient.writeContract(request)
```

### Parsing the logs

Once the transaction has been broadcasted, we can wait for the transaction receipt and pass the logs to a utils function to convert the logs of the limit order to a more readable format.

```ts
import { limitOrderResultFromLogs } from "@mangrovedao/mgv";

const tx = await walletClient.writeContract(request)

const receipt = await publicClient.waitForTransactionReceipt({
  hash: tx
})

const {
  takerGot,
  takerGave,
  feePaid,
  bounty,
  offer,
} = limitOrderResultFromLogs(
  actionParams,
  market,
  {
    logs: receipt.logs,
    bs: BS.buy,
    user: '0x...'
  }
)

if (offer) {
  // a limit order was posted
  const {
    id,
    tick,
    gives,
    wants,
    gasprice,
    gasreq
  } = offer
}
```

## Updating a limit order

To update a limit order, wa have to know the offer id of the limit order we want to udpate as well as the current gas requirement if we want to keep it the same.

Then we simply have to use the `simulate` function from the market client, this sends back a request that can be used to sign and broadcast the transaction.

```ts
const { request } = await marketClient.simulateUpdateOrder({
  id: 1n,
  // new values for base and quote amount
  baseAmount: parseEther('1'),
  quoteAmount: parseEther('3000'),
  // bs and book
  bs: BS.buy,
  book: book,
  // has to be specified even if it is the same
  restingOrderGasreq: 250_000n,
})

const tx = await walletClient.writeContract(request)

const receipt = await publicClient.waitForTransactionReceipt({
  hash: tx
})
```

## Cancelling a limit order

To cancel a limit order, we have to know the offer id of the limit order we want to cancel.

Then we simply have to use the `simulate` function from the market client, this sends back a request that can be used to sign and broadcast the transaction.

```ts
const { request } = await marketClient.simulateRemoveOrder({
  id: 1n,
  bs: BS.buy,
})

const tx = await walletClient.writeContract(request)

const receipt = await publicClient.waitForTransactionReceipt({
  hash: tx
})
```

This defaults to deprovisionning from mangrove (retracting all the funds unlocked on mangrove). But a flag `deprovision=false` can be passed to keep these funds on mangrove for future use.

## Creating a kandel

There are 2 types of client for kandel, the kandel client, and the kandel seeder client. One is used to deploy an instance of kandel, the other to interact with it.

### The kandel clients

To deploy a kandel, there is the kandel seeder client:

```ts
import { kandelSeederActions } from "@mangrovedao/mgv";
import { createClient } from "viem";

const client = createClient({ ... })

const kandelSeederClient = client.extend(
  kandelSeederActions(
    market, // the market object
    "0x..." // the kandel seeder address
  )
)

kandelSeederClient.simulateSow()
```

To interact with a kandel, there is the kandel client:

```ts
import { kandelActions } from "@mangrovedao/mgv";
import { createClient } from "viem";

const client = createClient({ ... })

const kandelClient = client.extend(
  kandelActions(
    actionParms, // the action params object (containing the mangrove address)
    market, // the market object
    "0x..." // the kandel address
  )
)

kandelClient.simulatePopulate({ ... })
```

### Getting the populate params (validating params)

In order to populate a kandel, we need to get the params for the populate function. These params gives us the distribution of the kandel.

Here are the parameters to pass to the `validateKandelParams` function :

| Parameter | Description |
| --- | --- |
| baseAmount | Amount of base to supply to the kandel |
| quoteAmount | Amount of quote to supply to the kandel |
| stepSize | The number of offers to jump in order to repost the dual offer |
| gasreq | The gas requirement to take a single offer |
| factor | A number to multiply the minimum volume by |
| asksLocalConfig | The local config for the asks |
| bidsLocalConfig | The local config for the bids |
| minPrice | The minimum price for the kandel |
| maxPrice | The maximum price for the kandel |
| midPrice | The wanted midPrice (should be the book midPrice) |
| pricePoints | The number of price points to use for the kandel |
| market | The market object |

you need to pass all these parameters to the `validateKandelParams` function.

```ts
import { validateKandelParams } from "@mangrovedao/mgv";

const {
  params,
  rawParams,
  minBaseAmount,
  minQuoteAmount,
  minProvision,
  isValid
} = validateKandelParams({
  baseAmount: parseEther('1'),
  quoteAmount: parseEther('3000'),
  stepSize: 1,
  gasreq: 250_000n,
  factor: 3,
  asksLocalConfig,
  bidsLocalConfig,
  minPrice: 2900,
  maxPrice: 3100,
  midPrice,
  pricePoints: 10n,
  market,
})
```

This function returns 5 params :
- `params` : the params to pass to the `populate` function
- `rawParams` : the raw params that have been adjusted. These have the same structure as the input params, but have been adjusted to fit the kandel constraints.
- `minBaseAmount` : the minimum base amount that can be used to populate the kandel
- `minQuoteAmount` : the minimum quote amount that can be used to populate the kandel
- `minProvision` : the minimum provision that can be used to populate the kandel
- `isValid` : a boolean that tells if the params are valid or not (amuont greater than min amount)

### Getting the kandel steps

In order to populate a kandel, we need to get the steps to do before calling the populate function.

```ts
const steps = await kandelClient.getKandelSteps({
  userRouter,
  user,
  gasreq: 250_000n,
})

steps[0] // wether to deploy or not the user router
steps[1] // wether to bind or not the user router to kandel
steps[2] // wether to set the logic or not on the contract
steps[3] // the approval needed for the base logic
steps[4] // the approval needed for the quote logic
```

### Populating a kandel

To populate a kandel, we need to call the `populate` function from the kandel client.

```ts
const {
  params,
  isValid
} = validateKandelParams({
  ...
})

if (!isValid) {
  // custom logic
  return
}


// Logics of the steps in there
// ...

const { request } = await kandelClient.simulatePopulate({
  ...params,
  account: '0x...',
})

const tx = await walletClient.writeContract(request)

const receipt = await publicClient.waitForTransactionReceipt({
  hash: tx
})
```

### Retracting a kandel

To retract a kandel, you can call the `simulateRetract` function. You have to know the number of price points in order to retract and pass it as the `to` parameter. `baseAmount` and/or `quoteAmount` can be specified if any amount is inside the kandel and to be removed from it.

```ts
const { request } = await kandelClient.simulateRetract({
  toIndex: pricePoints,
  baseAmount: parseEther('1'),
  quoteAmount: parseEther('3000'),
  // both of these addresses are suppoesedly the same
  recipient: '0x...',
  account: '0x...',
})
```
