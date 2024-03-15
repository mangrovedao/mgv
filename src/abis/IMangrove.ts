export const IMangrove = [
  {
    type: 'fallback',
    stateMutability: 'nonpayable',
  },
  {
    type: 'receive',
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'DOMAIN_SEPARATOR',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'PERMIT_TYPEHASH',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'activate',
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
        name: 'fee',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'density96X32',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'offer_gasbase',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
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
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
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
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
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
    name: 'balanceOf',
    inputs: [
      {
        name: 'maker',
        type: 'address',
        internalType: 'address',
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
    name: 'best',
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
    ],
    outputs: [
      {
        name: 'offerId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'cleanByImpersonation',
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
        name: 'targets',
        type: 'tuple[]',
        internalType: 'struct MgvLib.CleanTarget[]',
        components: [
          {
            name: 'offerId',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'tick',
            type: 'int256',
            internalType: 'Tick',
          },
          {
            name: 'gasreq',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'takerWants',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
      {
        name: 'taker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'successes',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'config',
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
    ],
    outputs: [
      {
        name: '_global',
        type: 'uint256',
        internalType: 'Global',
      },
      {
        name: '_local',
        type: 'uint256',
        internalType: 'Local',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'deactivate',
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
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'flashloan',
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
    outputs: [
      {
        name: 'gasused',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'makerData',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fund',
    inputs: [
      {
        name: 'maker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'fund',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'global',
    inputs: [],
    outputs: [
      {
        name: '_global',
        type: 'uint256',
        internalType: 'Global',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'governance',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'internalCleanByImpersonation',
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
      {
        name: 'tick',
        type: 'int256',
        internalType: 'Tick',
      },
      {
        name: 'gasreq',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'takerWants',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'taker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'kill',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'leafs',
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
        name: 'index',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'Leaf',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'level1s',
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
        name: 'index',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'Field',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'level2s',
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
        name: 'index',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'Field',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'level3s',
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
        name: 'index',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'Field',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'local',
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
    ],
    outputs: [
      {
        name: '_local',
        type: 'uint256',
        internalType: 'Local',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'locked',
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
    name: 'marketOrderByTick',
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
        name: 'maxTick',
        type: 'int256',
        internalType: 'Tick',
      },
      {
        name: 'fillVolume',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'fillWants',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [
      {
        name: 'takerGot',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'takerGave',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'feePaid',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'marketOrderByTickCustom',
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
        name: 'maxTick',
        type: 'int256',
        internalType: 'Tick',
      },
      {
        name: 'fillVolume',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'fillWants',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'maxGasreqForFailingOffers',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'takerGot',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'takerGave',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'feePaid',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'marketOrderByVolume',
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
        name: 'fillWants',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [
      {
        name: 'takerGot',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'takerGave',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'feePaid',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'marketOrderForByTick',
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
        name: 'maxTick',
        type: 'int256',
        internalType: 'Tick',
      },
      {
        name: 'fillVolume',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'fillWants',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'taker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'takerGot',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'takerGave',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'feePaid',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'marketOrderForByVolume',
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
        name: 'fillWants',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'taker',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'takerGot',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'takerGave',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'bounty',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'feePaid',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'newOfferByTick',
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
        name: 'tick',
        type: 'int256',
        internalType: 'Tick',
      },
      {
        name: 'gives',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasreq',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasprice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'offerId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'newOfferByVolume',
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
        name: 'wants',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gives',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasreq',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasprice',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'offerId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'nonces',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'nonce',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'offerData',
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
        name: 'offer',
        type: 'uint256',
        internalType: 'Offer',
      },
      {
        name: 'offerDetail',
        type: 'uint256',
        internalType: 'OfferDetail',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'offerDetails',
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
        name: 'offerDetail',
        type: 'uint256',
        internalType: 'OfferDetail',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'offers',
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
        name: 'offer',
        type: 'uint256',
        internalType: 'Offer',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'olKeys',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
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
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'permit',
    inputs: [
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
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'deadline',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'v',
        type: 'uint8',
        internalType: 'uint8',
      },
      {
        name: 'r',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 's',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'retractOffer',
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
      {
        name: 'deprovision',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [
      {
        name: 'provision',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'root',
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
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'Field',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'setDensity96X32',
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
    name: 'setFee',
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
        name: 'fee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGasbase',
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
        name: 'offer_gasbase',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGasmax',
    inputs: [
      {
        name: 'gasmax',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setGasprice',
    inputs: [
      {
        name: 'gasprice',
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
        name: 'governanceAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMaxGasreqForFailingOffers',
    inputs: [
      {
        name: 'maxGasreqForFailingOffers',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMaxRecursionDepth',
    inputs: [
      {
        name: 'maxRecursionDepth',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setMonitor',
    inputs: [
      {
        name: 'monitor',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setNotify',
    inputs: [
      {
        name: 'notify',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setUseOracle',
    inputs: [
      {
        name: 'useOracle',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateOfferByTick',
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
        name: 'tick',
        type: 'int256',
        internalType: 'Tick',
      },
      {
        name: 'gives',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasreq',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasprice',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'offerId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'updateOfferByVolume',
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
        name: 'wants',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gives',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasreq',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'gasprice',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'offerId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'withdraw',
    inputs: [
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'noRevert',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawERC20',
    inputs: [
      {
        name: 'tokenAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'outbound_tkn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'inbound_tkn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CleanComplete',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CleanStart',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'offersToBeCleaned',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Credit',
    inputs: [
      {
        name: 'maker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Debit',
    inputs: [
      {
        name: 'maker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Kill',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'NewMgv',
    inputs: [],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OfferFail',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'id',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'takerWants',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'takerGives',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'penalty',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
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
    name: 'OfferFailWithPosthookData',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'id',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'takerWants',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'takerGives',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'penalty',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'mgvData',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
      {
        name: 'posthookData',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OfferRetract',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'maker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'id',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'deprovision',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OfferSuccess',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'id',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'takerWants',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'takerGives',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OfferSuccessWithPosthookData',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'id',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'takerWants',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'takerGives',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'posthookData',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OfferWrite',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'maker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tick',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'gives',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'gasprice',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'gasreq',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'id',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderComplete',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'fee',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OrderStart',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'taker',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'maxTick',
        type: 'int256',
        indexed: false,
        internalType: 'Tick',
      },
      {
        name: 'fillVolume',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'fillWants',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetActive',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'outbound_tkn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'inbound_tkn',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'tickSpacing',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'value',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetDensity96X32',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetFee',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetGasbase',
    inputs: [
      {
        name: 'olKeyHash',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'offer_gasbase',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetGasmax',
    inputs: [
      {
        name: 'value',
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
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetGovernance',
    inputs: [
      {
        name: 'value',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetMaxGasreqForFailingOffers',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetMaxRecursionDepth',
    inputs: [
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetMonitor',
    inputs: [
      {
        name: 'value',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetNotify',
    inputs: [
      {
        name: 'value',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'SetUseOracle',
    inputs: [
      {
        name: 'value',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
] as const
