import Map from "./components/Map"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AddMessageRA } from "./components/AddMessageRA";
import { LayerChoiceModal } from "./components/LayerChoiceModal";

function App() {
  return (
    <div className="app">
      <main>
        <Header />
        <Map />
        <Footer />
      </main>
      <AddMessageRA />
      <LayerChoiceModal />
    </div>
  );
}

export default App;
