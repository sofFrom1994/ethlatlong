import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem'
import { baseSepolia, hardhat } from 'wagmi/chains';

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
console.log(projectId);
const appURL = import.meta.env.APP_URL;

export const config = getDefaultConfig({
  appName: "eth-lat-long",
  projectId: projectId,
  appUrl: appURL,
  ssr: false,
  chains: [baseSepolia, hardhat],
  transports: {
    [baseSepolia.id]: http(),
    [31_337]: http("http://127.0.0.1:8545/")
  }
})
