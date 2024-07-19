import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EthLatLongModule = buildModule("EthLatLongModule", (m) => {
  const ell = m.contract("EthLatLong");
  m.call(ell, "addLayer", [
    "layer 1", " just a layer", 83, 83, 3128735 
  ]);
  m.call(ell, "addLayer", [
    "layer 2", " just a layer", 85, 89, 3091359
  ], {id: "someotheridd"});
  m.call(ell, "addMessage", [
    "layer 1", 45, 83, "this "
  ], { id: "anotherid"});
  m.call(ell, "addMessage", [
    "layer 1", 25, 83, "thisahfhddiahi"
  ], { id: "anotherid2"});
  m.call(ell, "addMessage", [
    "layer 2", 25, 43, "tahdihfdiahhahidhfdfihiage"
  ], { id: "anotherid223"});


  return { ell };
});

export default EthLatLongModule;
