import { fallback, http } from 'viem'
import { createConfig } from 'wagmi'

import { baseSepolia, hardhat } from 'wagmi/chains';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

const metamaskOptions = {
  dappMetadata: {
    name: "eth-lat-long"
  }
}

export const config = createConfig(
  {
    connectors: [metaMask(metamaskOptions), injected(), coinbaseWallet()],
    chains: [baseSepolia, hardhat],
    transports: {
      [baseSepolia.id] : http(),
      [31_337]: http("http://127.0.0.1:8545/")
    }
  }
);

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
