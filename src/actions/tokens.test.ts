import { ContractFunctionExecutionError, zeroAddress } from 'viem'
import { describe, expect, inject, it } from 'vitest'
import { getClient } from '~test/src/client.js'
import { GetTokenInfoError, getTokens } from './tokens.js'
const { WETH, USDC, DAI } = inject('tokens')
const client = getClient()

describe('tokens', () => {
  it('should get tokens', async () => {
    const tokens = await getTokens(client, { tokens: [WETH.address] as const })
    expect(tokens).toEqual([WETH])

    const foundWETH = tokens[0]

    expect(foundWETH.mgvTestToken).toBe(false)
    expect(foundWETH.address).toBe(WETH.address)
    expect(foundWETH.symbol).toBe(WETH.symbol)
    expect(foundWETH.decimals).toBe(WETH.decimals)
  })

  it('should get multiple tokens', async () => {
    const tokens = await getTokens(client, {
      tokens: [WETH.address, USDC.address, DAI.address] as const,
    })
    expect(tokens).toEqual([WETH, USDC, DAI])

    const foundWETH = tokens[0]
    expect(foundWETH.mgvTestToken).toBe(false)
    expect(foundWETH.address).toBe(WETH.address)
    expect(foundWETH.symbol).toBe(WETH.symbol)
    expect(foundWETH.decimals).toBe(WETH.decimals)

    const foundUSDC = tokens[1]
    expect(foundUSDC.mgvTestToken).toBe(false)
    expect(foundUSDC.address).toBe(USDC.address)
    expect(foundUSDC.symbol).toBe(USDC.symbol)
    expect(foundUSDC.decimals).toBe(USDC.decimals)

    const foundDAI = tokens[2]
    expect(foundDAI.mgvTestToken).toBe(false)
    expect(foundDAI.address).toBe(DAI.address)
    expect(foundDAI.symbol).toBe(DAI.symbol)
    expect(foundDAI.decimals).toBe(DAI.decimals)
  })

  it('should get test tokens', async () => {
    const tokens = await getTokens(client, {
      tokens: [WETH.address] as const,
      testTokens: [WETH.address],
    })

    const foundWETH = tokens[0]
    expect(foundWETH.mgvTestToken).toBe(true)
    expect(foundWETH.address).toBe(WETH.address)
    expect(foundWETH.symbol).toBe(WETH.symbol)
    expect(foundWETH.decimals).toBe(WETH.decimals)
  })

  it('should have display decimals', async () => {
    const tokens = await getTokens(client, {
      tokens: [WETH.address, USDC.address, DAI.address] as const,
      displayDecimals: { [WETH.symbol]: 1000 },
      priceDisplayDecimals: { [WETH.symbol]: 1000 },
    })

    const foundWETH = tokens[0]
    expect(foundWETH.displayDecimals).toBe(1000)
    expect(foundWETH.priceDisplayDecimals).toBe(1000)
  })

  it('should fail on unknown token', async () => {
    try {
      await getTokens(client, { tokens: [zeroAddress] as const })
    } catch (error) {
      expect(error).toBeInstanceOf(GetTokenInfoError)
      const typedError = error as GetTokenInfoError
      expect(typedError.shortMessage).toBe(
        `No decimals found for token ${zeroAddress}`,
      )
      expect(typedError.cause).toBeInstanceOf(ContractFunctionExecutionError)
      const typedCause = typedError.cause as ContractFunctionExecutionError
      expect(typedCause.contractAddress).toBe(zeroAddress)
    }
  })
})
