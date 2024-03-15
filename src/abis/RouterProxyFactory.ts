export const RouterProxyFactory = [
  {
    type: 'function',
    name: 'computeProxyAddress',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'routerImplementation',
        type: 'address',
        internalType: 'contract AbstractRouter',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deployProxy',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'routerImplementation',
        type: 'address',
        internalType: 'contract AbstractRouter',
      },
    ],
    outputs: [
      {
        name: 'proxy',
        type: 'address',
        internalType: 'contract RouterProxy',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'instantiate',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'routerImplementation',
        type: 'address',
        internalType: 'contract AbstractRouter',
      },
    ],
    outputs: [
      {
        name: 'proxy',
        type: 'address',
        internalType: 'contract RouterProxy',
      },
      {
        name: 'created',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'ProxyDeployed',
    inputs: [
      {
        name: 'proxy',
        type: 'address',
        indexed: false,
        internalType: 'contract RouterProxy',
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'implementation',
        type: 'address',
        indexed: true,
        internalType: 'contract AbstractRouter',
      },
    ],
    anonymous: false,
  },
] as const
