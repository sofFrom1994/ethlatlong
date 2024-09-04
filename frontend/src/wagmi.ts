import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem'
import { baseSepolia } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const appURL = import.meta.env.VITE_APP_URL;

export const config = getDefaultConfig({
  appName: "you-are-here",
  projectId: projectId,
  appUrl: appURL,
  ssr: false,
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http()
  }
})
