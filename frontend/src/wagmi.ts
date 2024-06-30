import { fallback, http } from 'viem'
import { createConfig } from 'wagmi'

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injectedWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets"
import { hardhat } from 'wagmi/chains';

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [metaMaskWallet, coinbaseWallet]
  },
  {
    groupName: 'Fallback',
    wallets: [injectedWallet]
  }
], {
  projectId: "ethLatLong",
  appName: "ethLatLong"
})

export const config = createConfig(
  {
    connectors,
    chains: [hardhat],
    transports: {
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
