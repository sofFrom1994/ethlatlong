import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EthLatLongModule = buildModule("mockDeploy", (m) => {
  const ell = m.contract("mockERC721");
  m.call(ell, "addLayer", [
    "layer 1", " just a layer", 83, 83
  ]);

  return { ell };
});

export default EthLatLongModule;
