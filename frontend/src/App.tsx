import Map from "./components/Map"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useAccount } from "wagmi";

function App() {
  const account = useAccount();
  return (
      <main>
        <Header account={account}/>
        <Map account={account}/>
        <Footer />
      </main>
  );
}

export default App;
