import  Map  from "./components/Map"

import { Header } from "./components/Header";
import { LayerChoiceModal } from "./components/LayerChoiceModal";

function App() {
  return (
    <div className="app">
      <main>
        <Header />
        <Map />
        <LayerChoiceModal />
      </main>
    </div>
  );
}

export default App;
