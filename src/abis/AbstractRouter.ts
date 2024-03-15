export const AbstractRouter = [
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
    name: 'bind',
    inputs: [
      {
        name: 'makerContract',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'flush',
    inputs: [
      {
        name: 'routingOrders',
        type: 'tuple[]',
        internalType: 'struct RoutingOrderLib.RoutingOrder[]',
        components: [
          {
            name: 'token',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'olKeyHash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'fundOwner',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isBound',
    inputs: [
      {
        name: 'mkr',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pull',
    inputs: [
      {
        name: 'routingOrder',
        type: 'tuple',
        internalType: 'struct RoutingOrderLib.RoutingOrder',
        components: [
          {
            name: 'token',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'olKeyHash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'fundOwner',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'strict',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [
      {
        name: 'pulled',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'push',
    inputs: [
      {
        name: 'routingOrder',
        type: 'tuple',
        internalType: 'struct RoutingOrderLib.RoutingOrder',
        components: [
          {
            name: 'token',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'olKeyHash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'fundOwner',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'pushed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'tokenBalanceOf',
    inputs: [
      {
        name: 'routingOrder',
        type: 'tuple',
        internalType: 'struct RoutingOrderLib.RoutingOrder',
        components: [
          {
            name: 'token',
            type: 'address',
            internalType: 'contract IERC20',
          },
          {
            name: 'olKeyHash',
            type: 'bytes32',
            internalType: 'bytes32',
          },
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'fundOwner',
            type: 'address',
            internalType: 'address',
          },
        ],
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'unbind',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'unbind',
    inputs: [
      {
        name: 'makerContract',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'MakerBind',
    inputs: [
      {
        name: 'maker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'MakerUnbind',
    inputs: [
      {
        name: 'maker',
        type: 'address',
        indexed: true,
        internalType: 'address',
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
