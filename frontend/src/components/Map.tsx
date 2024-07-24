import L, { LatLngExpression, LatLngTuple } from "leaflet";
import { Layer } from "./types";
import { MinimapControl } from "./MinimapControl";
import { LayerChoiceModal } from "./LayerChoiceModal";
import { AddMenu } from "./Add";
import { MapContainer, TileLayer } from "react-leaflet";

import "../styles/Map.css";
import { UserLocation } from "./UserLocation";
import filterI from "../assets/filter.svg";

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

const Filter = () => {
  return (
    <p className="filter">
        <img src={filterI} alt="" />Filter
    </p>
  );
};

const Map = (Map: MapProps) => {
  const { zoom = defaults.zoom } = Map;
  return (
    <MapContainer
      zoom={zoom}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      center={[51.505, -0.09]}
      style={{ height: "100%", width: "100%" }}
      className="map-wrapper"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayerChoiceModal />
      <MinimapControl position="bottomright" zoom={5} />
      <div className="map-controls">
        <UserLocation />
        <AddMenu />
        <Filter />
      </div>
    </MapContainer>
  );
};

export default Map;
