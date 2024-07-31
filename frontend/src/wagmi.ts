import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem'

import { baseSepolia, hardhat } from 'wagmi/chains';
/*
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


*/

export const config = getDefaultConfig({
  appName: "eth-lat-long",
  projectId: "eth-lat-long",
  chains: [baseSepolia, hardhat],
  transports: {
    [baseSepolia.id]: http(),
    [31_337]: http("http://127.0.0.1:8545/")
  }
})
