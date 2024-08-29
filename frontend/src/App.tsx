import { MainMap } from "./components/MainMap";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { ethLatLongAbi } from "./generated";
import { layerType } from "./components/types";
import { ReadContractErrorType } from "wagmi/actions";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const account = useAccount();
  const [map, setMap] = useState<L.Map | null>(null);
  const [layers, setLayers] = useState<layerType[]>([]);
  const [error, setError] = useState<ReadContractErrorType | null>(null);

  useEffect(() => {
    map?.on("focus", () => {
      map?.scrollWheelZoom.enable();
    });
    map?.on("blur", () => {
      map?.scrollWheelZoom.disable();
    });
  }, []);

const {
  data,
  error: readError,
  refetch,
} = useReadContract({
  abi,
  address: contract_address,
  functionName: "getAllLayers",
  blockTag: "latest",
  query: {
    staleTime: Infinity,
  },
});

  useEffect(() => {
    if (readError) {
      setError(readError);
    } else {
      const uniqueLayers = data ? [...new Set(data)] : [];
      setLayers(uniqueLayers);
    }
  }, [data, readError]);
  return (
    <main>
      <Header account={account} map={map} layers={layers} error={error} />
      <MainMap account={account} mapRef={setMap} layers={layers} refetch={refetch} error={error} />
      <Footer />
    </main>
  );
}

export default App;
