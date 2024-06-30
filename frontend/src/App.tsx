import Map from "./components/Map"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AddMessageRA } from "./components/AddMessageRA";

function App() {
  return (
    <div className="app">
      <main>
        <Header />
        <Map />
        <Footer />
      </main>
      <AddMessageRA />
    </div>
  );
}

export default App;
