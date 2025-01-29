import type { MangroveActionsDefaultParams } from '../../types/index.js'

export const baseMangrove = {
  mgv: '0x22613524f5905Cb17cbD785b956e9238Bf725FAa',
  mgvOrder: '0xA3c363Ca0EA3603faEe9FAcffD65E777122adF36',
  mgvReader: '0xe5B118Ea1ffBC502EA7A666376d448209BFB50d3',
  smartRouter: '0x1424D7428dc11623100df1A3D06088C2d87fBE32',
  routerProxyFactory: '0x2926Cc3977F93a51465f9742c548e67220Af54e9',
} as const satisfies MangroveActionsDefaultParams
