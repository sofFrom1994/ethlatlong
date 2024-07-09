import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { Layer } from "./types";
import { MinimapControl } from "./MinimapControl";
import { LayerChoiceModal } from "./LayerChoiceModal";
import { Add } from "./Add";

import "../styles/Map.css"

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
  layers?: [Layer];
}

const baseLayer: Layer = {
  name: "baseLayer",
  baseLocation: [0, 0],
};

const defaults: MapProps = {
  zoom: 12,
  posix: [0, 0],
  layers: [baseLayer],
};

function MapPlaceholder() {
  return (
    <p>
      Map. <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}


const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom } = Map;
  return (
    <div className="map-wrapper" >
      <MapContainer
        zoom={zoom}
        scrollWheelZoom={false}
        placeholder={<MapPlaceholder />}
        center={[51.505, -0.09]}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayerChoiceModal />
        <MinimapControl position="bottomright" zoom={5} />
      </MapContainer>
      <div className="map-controls">
        <p> your location </p>
        <Add />
        <p> filter </p>
      </div>
    </div>
  );
};

export default Map;
