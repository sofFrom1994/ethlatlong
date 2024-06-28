import "./styles/App.css"
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import  Map  from "./components/Map"

import { Header } from "./components/Header";

function App() {
  return (
    <div className="app">
      <main>
        <Header />
        <Map />
      </main>
    </div>
  );
}

export default App;
