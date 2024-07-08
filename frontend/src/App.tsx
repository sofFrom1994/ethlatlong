import Map from "./components/Map"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

function App() {
  return (
    <div className="app">
      <main>
        <Header />
        <Map />
        <Footer />
      </main>
    </div>
  );
}

export default App;
