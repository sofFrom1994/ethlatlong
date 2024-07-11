import { LatLngExpression, LatLngTuple } from "leaflet";
import { Layer } from "./types";
import { MinimapControl } from "./MinimapControl";
import { LayerChoiceModal } from "./LayerChoiceModal";
import { AddMenu } from "./Add";

import "../styles/Map.css"
import userIcon from "../assets/userlocation.svg"

import { useState, useEffect } from "react";
import { useMap, Marker, MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

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

const icon = L.icon({
  iconUrl: userIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export const UserLocation = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [bbox, setBbox] = useState<string[]>([]);
  const [locate, setLocate] = useState(false);
  const map = useMap();

  useEffect(() => {
    if (locate) {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        setBbox(e.bounds.toBBoxString().split(","));
      });
    }
  }, [locate, map]);

  return (
    <>
      <button onClick={() => setLocate(true)}>My Location</button>
      {position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
      )}
    </>
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
        <p className="greyed-out"> Filter </p>
      </div>
    </MapContainer>
  );
};

export default Map;