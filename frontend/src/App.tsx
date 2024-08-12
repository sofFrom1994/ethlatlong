import Map from "./components/Map"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useAccount } from "wagmi";
import { useState } from "react";

function App() {
  const account = useAccount();
  const [map, setMap] = useState<L.Map | null>(null);
  return (
      <main>
        <Header account={account} map={map}/>
        <Map account={account} mapRef={setMap}/>
        <Footer />
      </main>
  );
}

export default App;
