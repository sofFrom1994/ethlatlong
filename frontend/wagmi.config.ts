import { defineConfig } from '@wagmi/cli'
import { hardhat } from '@wagmi/cli/plugins'
import { react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated.ts',
  contracts: [],
  plugins: [
    hardhat(
      {
        project: "../contracts",
      include: [
        "*.json"
      ],
      exclude: [
        "*.*"
      ],
      artifacts: "artifacts/contracts/EthLatLong.sol"
      }
    ),
    react(),
  ],

})
