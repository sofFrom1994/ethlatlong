import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

import * as dotenv from 'dotenv';
dotenv.config();

//import "@nomicfoundation/hardhat-chai-matchers"

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      chainId: 31337
    },

    "base-sepolia": {
      url: 'https://sepolia.base.org',
      accounts: [process.env.BASE_SEPOLIA_PRIVATE_KEY as string],
      gasPrice: 1000000000,
    },
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      "base-sepolia": process.env.BASESCAN_API_KEY!
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  }
};

export default config;
