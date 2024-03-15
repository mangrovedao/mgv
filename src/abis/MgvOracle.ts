export const MgvOracle = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'governance_',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'initialMutator_',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'initialGasPrice_',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'notifyFail',
    inputs: [
      {
        name: 'sor',
        type: 'tuple',
        internalType: 'struct MgvLib.SingleOrder',
        components: [
          {
            name: 'olKey',
            type: 'tuple',
            internalType: 'struct OLKey',
            components: [
              {
                name: 'outbound_tkn',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'inbound_tkn',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'tickSpacing',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'offer',
            type: 'uint256',
            internalType: 'Offer',
          },
          {
            name: 'takerWants',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'takerGives',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'offerDetail',
            type: 'uint256',
            internalType: 'OfferDetail',
          },
          {
            name: 'global',
            type: 'uint256',
            internalType: 'Global',
          },
          {
            name: 'local',
            type: 'uint256',
            internalType: 'Local',
          },
        ],
      },
      {
        name: 'taker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'notifySuccess',
    inputs: [
      {
        name: 'sor',
        type: 'tuple',
        internalType: 'struct MgvLib.SingleOrder',
        components: [
          {
            name: 'olKey',
            type: 'tuple',
            internalType: 'struct OLKey',
            components: [
              {
                name: 'outbound_tkn',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'inbound_tkn',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'tickSpacing',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'offer',
            type: 'uint256',
            internalType: 'Offer',
          },
          {
            name: 'takerWants',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'takerGives',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'offerDetail',
            type: 'uint256',
            internalType: 'OfferDetail',
          },
          {
            name: 'global',
            type: 'uint256',
            internalType: 'Global',
          },
          {
            name: 'local',
            type: 'uint256',
            internalType: 'Local',
          },
        ],
      },
      {
        name: 'taker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'read',
    inputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct OLKey',
        components: [
          {
            name: 'outbound_tkn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'inbound_tkn',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'tickSpacing',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'gasprice',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'density',
        type: 'uint256',
        internalType: 'Density',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setDensity96X32',
    inputs: [
      {
        name: 'density96X32',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGasPrice',
    inputs: [
      {
        name: 'gasPrice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGovernance',
    inputs: [
      {
        name: 'governance_',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMutator',
    inputs: [
      {
        name: 'mutator_',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'SetDensity96X32',
    inputs: [
      {
        name: 'density96X32',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetGasprice',
    inputs: [
      {
        name: 'gasPrice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
] as const
