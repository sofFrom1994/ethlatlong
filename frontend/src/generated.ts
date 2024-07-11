import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EthLatLong
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ethLatLongAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'LayerAdded',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      { name: 'lat', internalType: 'SD59x18', type: 'int256' },
      { name: 'long', internalType: 'SD59x18', type: 'int256' },
    ],
    name: 'addLayer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'erc721Address', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'lat', internalType: 'SD59x18', type: 'int256' },
      { name: 'long', internalType: 'SD59x18', type: 'int256' },
      { name: 'layerName', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'addMedia',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'layerName', internalType: 'string', type: 'string' },
      { name: 'lat', internalType: 'SD59x18', type: 'int256' },
      { name: 'long', internalType: 'SD59x18', type: 'int256' },
      { name: 'message', internalType: 'string', type: 'string' },
    ],
    name: 'addMessage',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllEmbeds',
    outputs: [
      {
        name: '',
        internalType: 'struct EthLatLong.Embed[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          {
            name: 'kind',
            internalType: 'enum EthLatLong.Kinds',
            type: 'uint8',
          },
          { name: 'message', internalType: 'string', type: 'string' },
          { name: 'lat', internalType: 'SD59x18', type: 'int256' },
          { name: 'long', internalType: 'SD59x18', type: 'int256' },
          { name: 'author', internalType: 'address', type: 'address' },
          { name: 'url', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getAllLayers',
    outputs: [
      {
        name: '',
        internalType: 'struct EthLatLong.Layer[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'embedN', internalType: 'uint256', type: 'uint256' },
          {
            name: 'embeds',
            internalType: 'struct EthLatLong.Embed[]',
            type: 'tuple[]',
            components: [
              { name: 'id', internalType: 'uint256', type: 'uint256' },
              {
                name: 'kind',
                internalType: 'enum EthLatLong.Kinds',
                type: 'uint8',
              },
              { name: 'message', internalType: 'string', type: 'string' },
              { name: 'lat', internalType: 'SD59x18', type: 'int256' },
              { name: 'long', internalType: 'SD59x18', type: 'int256' },
              { name: 'author', internalType: 'address', type: 'address' },
              { name: 'url', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'lat', internalType: 'SD59x18', type: 'int256' },
          { name: 'long', internalType: 'SD59x18', type: 'int256' },
          { name: 'author', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'layerName', internalType: 'string', type: 'string' }],
    name: 'getEmbeds',
    outputs: [
      {
        name: 'embeds',
        internalType: 'struct EthLatLong.Embed[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          {
            name: 'kind',
            internalType: 'enum EthLatLong.Kinds',
            type: 'uint8',
          },
          { name: 'message', internalType: 'string', type: 'string' },
          { name: 'lat', internalType: 'SD59x18', type: 'int256' },
          { name: 'long', internalType: 'SD59x18', type: 'int256' },
          { name: 'author', internalType: 'address', type: 'address' },
          { name: 'url', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'name', internalType: 'string', type: 'string' }],
    name: 'getLayer',
    outputs: [
      {
        name: '',
        internalType: 'struct EthLatLong.Layer',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'embedN', internalType: 'uint256', type: 'uint256' },
          {
            name: 'embeds',
            internalType: 'struct EthLatLong.Embed[]',
            type: 'tuple[]',
            components: [
              { name: 'id', internalType: 'uint256', type: 'uint256' },
              {
                name: 'kind',
                internalType: 'enum EthLatLong.Kinds',
                type: 'uint8',
              },
              { name: 'message', internalType: 'string', type: 'string' },
              { name: 'lat', internalType: 'SD59x18', type: 'int256' },
              { name: 'long', internalType: 'SD59x18', type: 'int256' },
              { name: 'author', internalType: 'address', type: 'address' },
              { name: 'url', internalType: 'string', type: 'string' },
              { name: 'description', internalType: 'string', type: 'string' },
            ],
          },
          { name: 'lat', internalType: 'SD59x18', type: 'int256' },
          { name: 'long', internalType: 'SD59x18', type: 'int256' },
          { name: 'author', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'layerNames',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'erc721Address', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removeMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethLatLongAbi}__
 */
export const useReadEthLatLong = /*#__PURE__*/ createUseReadContract({
  abi: ethLatLongAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"getAllEmbeds"`
 */
export const useReadEthLatLongGetAllEmbeds =
  /*#__PURE__*/ createUseReadContract({
    abi: ethLatLongAbi,
    functionName: 'getAllEmbeds',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"getAllLayers"`
 */
export const useReadEthLatLongGetAllLayers =
  /*#__PURE__*/ createUseReadContract({
    abi: ethLatLongAbi,
    functionName: 'getAllLayers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"getEmbeds"`
 */
export const useReadEthLatLongGetEmbeds = /*#__PURE__*/ createUseReadContract({
  abi: ethLatLongAbi,
  functionName: 'getEmbeds',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"getLayer"`
 */
export const useReadEthLatLongGetLayer = /*#__PURE__*/ createUseReadContract({
  abi: ethLatLongAbi,
  functionName: 'getLayer',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"layerNames"`
 */
export const useReadEthLatLongLayerNames = /*#__PURE__*/ createUseReadContract({
  abi: ethLatLongAbi,
  functionName: 'layerNames',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethLatLongAbi}__
 */
export const useWriteEthLatLong = /*#__PURE__*/ createUseWriteContract({
  abi: ethLatLongAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"addLayer"`
 */
export const useWriteEthLatLongAddLayer = /*#__PURE__*/ createUseWriteContract({
  abi: ethLatLongAbi,
  functionName: 'addLayer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"addMedia"`
 */
export const useWriteEthLatLongAddMedia = /*#__PURE__*/ createUseWriteContract({
  abi: ethLatLongAbi,
  functionName: 'addMedia',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"addMessage"`
 */
export const useWriteEthLatLongAddMessage =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethLatLongAbi,
    functionName: 'addMessage',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"removeMetadata"`
 */
export const useWriteEthLatLongRemoveMetadata =
  /*#__PURE__*/ createUseWriteContract({
    abi: ethLatLongAbi,
    functionName: 'removeMetadata',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethLatLongAbi}__
 */
export const useSimulateEthLatLong = /*#__PURE__*/ createUseSimulateContract({
  abi: ethLatLongAbi,
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"addLayer"`
 */
export const useSimulateEthLatLongAddLayer =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethLatLongAbi,
    functionName: 'addLayer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"addMedia"`
 */
export const useSimulateEthLatLongAddMedia =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethLatLongAbi,
    functionName: 'addMedia',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"addMessage"`
 */
export const useSimulateEthLatLongAddMessage =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethLatLongAbi,
    functionName: 'addMessage',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ethLatLongAbi}__ and `functionName` set to `"removeMetadata"`
 */
export const useSimulateEthLatLongRemoveMetadata =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ethLatLongAbi,
    functionName: 'removeMetadata',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethLatLongAbi}__
 */
export const useWatchEthLatLongEvent =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ethLatLongAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ethLatLongAbi}__ and `eventName` set to `"LayerAdded"`
 */
export const useWatchEthLatLongLayerAddedEvent =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ethLatLongAbi,
    eventName: 'LayerAdded',
  })
