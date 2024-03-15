export const MangroveOffer = [
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'MGV',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract IMangrove',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'ROUTER_IMPLEMENTATION',
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
    type: 'function',
    name: 'activate',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'admin',
    inputs: [],
    outputs: [
      {
        name: 'current',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        name: 'token',
        type: 'address',
        internalType: 'contract IERC20',
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'makerExecute',
    inputs: [
      {
        name: 'order',
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
    ],
    outputs: [
      {
        name: 'ret',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'makerPosthook',
    inputs: [
      {
        name: 'order',
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
        name: 'result',
        type: 'tuple',
        internalType: 'struct MgvLib.OrderResult',
        components: [
          {
            name: 'makerData',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'mgvData',
            type: 'bytes32',
            internalType: 'bytes32',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'provisionOf',
    inputs: [
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
    ],
    outputs: [
      {
        name: 'provision',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'router',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'router',
        type: 'address',
        internalType: 'contract AbstractRouter',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setAdmin',
    inputs: [
      {
        name: 'admin_',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawFromMangrove',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'LogIncident',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'offerId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'makerData',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'mgvData',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
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
