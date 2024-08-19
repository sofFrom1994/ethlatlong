import { MainMap } from "./components/MainMap";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useAccount } from "wagmi";
import { useState } from "react";

function App() {
  const account = useAccount();
  const [map, setMap] = useState<L.Map | null>(null);
  return (
    <main>
      <Header account={account} map={map} />
      <MainMap account={account} mapRef={setMap} />
      <Footer />
    </main>
  );
}

export default App;
