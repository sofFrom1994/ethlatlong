import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EthLatLongModule = buildModule("EthLatLongModule", (m) => {
  const ell = m.contract("EthLatLong");
  return { ell };
});

export default EthLatLongModule;
