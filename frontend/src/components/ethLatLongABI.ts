export const abi = [
  {
    type: 'event',
    name: 'EmbedAdded',
    inputs: [
      { indexed: false, internalType: 'string', name: 'layer', type: 'string' },
      { indexed: false, internalType: 'string', name: 'content', type: 'string' },
      { indexed: false, internalType: 'SD59x18', name: 'lat', type: 'int256' },
      { indexed: false, internalType: 'SD59x18', name: 'long', type: 'int256' },
    ],
  },
  {
    type: 'event',
    name: 'LayerAdded',
    inputs: [
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'string', name: 'description', type: 'string' },
    ],
  },
  {
    type: 'function',
    name: 'addLayer',
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'SD59x18', name: 'lat', type: 'int256' },
      { internalType: 'SD59x18', name: 'long', type: 'int256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addMessage',
    inputs: [
      { internalType: 'string', name: 'layerName', type: 'string' },
      { internalType: 'SD59x18', name: 'lat', type: 'int256' },
      { internalType: 'SD59x18', name: 'long', type: 'int256' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getEmbeds',
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
    ],
    outputs: [
      {
        internalType: 'tuple[]',
        name: 'embeds',
        type: 'struct EthLatLong.Embed[]',
        components: [
          { internalType: 'uint256', name: 'id', type: 'uint256' },
          { internalType: 'enum EthLatLong.Kinds', name: 'kind', type: 'uint8' },
          { internalType: 'string', name: 'message', type: 'string' },
          {
            internalType: 'tuple',
            name: 'location',
            type: 'struct EthLatLong.Location',
            components: [
              { internalType: 'SD59x18', name: 'long', type: 'int256' },
              { internalType: 'SD59x18', name: 'lat', type: 'int256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLayer',
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
    ],
    outputs: [
      {
        internalType: 'tuple',
        name: '',
        type: 'struct EthLatLong.Layer',
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'description', type: 'string' },
          { internalType: 'uint256', name: 'embedN', type: 'uint256' },
          {
            internalType: 'tuple[]',
            name: 'embeds',
            type: 'struct EthLatLong.Embed[]',
            components: [
              { internalType: 'uint256', name: 'id', type: 'uint256' },
              { internalType: 'enum EthLatLong.Kinds', name: 'kind', type: 'uint8' },
              { internalType: 'string', name: 'message', type: 'string' },
              {
                internalType: 'tuple',
                name: 'location',
                type: 'struct EthLatLong.Location',
                components: [
                  { internalType: 'SD59x18', name: 'long', type: 'int256' },
                  { internalType: 'SD59x18', name: 'lat', type: 'int256' },
                ],
              },
            ],
          },
          {
            internalType: 'tuple',
            name: 'startingLoc',
            type: 'struct EthLatLong.Location',
            components: [
              { internalType: 'SD59x18', name: 'long', type: 'int256' },
              { internalType: 'SD59x18', name: 'lat', type: 'int256' },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
] as const;
