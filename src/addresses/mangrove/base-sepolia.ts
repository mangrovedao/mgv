import type { MangroveActionsDefaultParams } from '../../types/index.js'

export const baseSepoliaMangrove = {
  mgv: '0xBe1E54d0fC7A6044C0913013593FCd7D854C07FB',
  mgvOrder: '0xC00D2Da52195B123d3c994aaf2eb1E8DA8999d4f',
  mgvReader: '0xe118B2CF4e893DD8D954bB1D629e95026b5E8D5A',
  smartRouter: '0xF83D022384268A1cc2e3CEb0EB19336E9cb8cB3b',
  routerProxyFactory: '0xE44FfC50ED6673d6A1C385B76152E1551a6c14a3',
} as const satisfies MangroveActionsDefaultParams
