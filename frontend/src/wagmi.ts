import { fallback, http } from 'viem'
import { createConfig } from 'wagmi'
import { localhost } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export const config = createConfig({
  chains: [localhost],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [localhost.id] : fallback([http("http://127.0.0.1:8545/")])
    /*
    [mainnet.id] : http:(),
    [sepolia.id] : http:(),
    */
  }
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
