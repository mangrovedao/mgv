export const RouterProxy = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'implementation',
        type: 'address',
        internalType: 'contract AbstractRouter',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'fallback',
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'IMPLEMENTATION',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract AbstractRouter',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'SetAdmin',
    inputs: [
      {
        name: 'admin',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
] as const
