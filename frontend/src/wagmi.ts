import { fallback, http } from 'viem'
import { createConfig } from 'wagmi'
import { localhost } from 'wagmi/chains'

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, injectedWallet, metaMaskWallet } from "@rainbow-me/rainbowkit/wallets"

import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';

const walletConnectors = connectorsForWallets([
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

export const config = getDefaultConfig(
  {
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    ssr: false, // If your dApp uses server side rendering (SSR)
    chains: [localhost],
    connectors: walletConnectors,
    transports: {
      [localhost.id]: fallback([http("http://127.0.0.1:8545/")])
      /*
      [mainnet.id] : http:(),
      [sepolia.id] : http:(),
      */
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
