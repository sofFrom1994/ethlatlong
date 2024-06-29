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
        exclude: [ 
        // the following patterns are excluded by default
        'build-info/**', 
        '*.dbg.json', 
        // need to exclude typescript type definitions
        '*.d.ts'
      ], 
      artifacts: "artifacts/contracts/EthLatLong.sol"
      }
    ),
    react(),
  ],

})
