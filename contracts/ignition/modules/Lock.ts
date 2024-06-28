import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LockModule = buildModule("EthLatLongModule", (m) => {
  const ell = m.contract("EthLatLong");
  return { ell };
});

export default LockModule;
