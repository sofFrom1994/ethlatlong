import  Map  from "./components/Map"

import "./styles/App.css"
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
