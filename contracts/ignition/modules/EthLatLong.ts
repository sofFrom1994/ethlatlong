import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EthLatLongModule = buildModule("EthLatLongModule", (m) => {
  const ell = m.contract("EthLatLong");
  m.call(ell, "addLayer", [
    "layer 1", " just a layer", 83, 83
  ]);
  m.call(ell, "addMessage", [
    "layer 1", 85, 83, "this is a message"
  ]);

  return { ell };
});

export default EthLatLongModule;
