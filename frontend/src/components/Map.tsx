import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { MinimapControl } from "./MinimapControl";
import { AddMenu } from "./Add";
import "../styles/Map.css";
import { UserLocation } from "./UserLocation";
import { LayerChoiceModal } from "./LayersControl";
import { markerFilter } from "./types";
import { FilterMenu } from "./MarkerFilter";

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
}

const defaults: MapProps = {
  zoom: 4,
  posix: [0, 0],
};

function MapPlaceholder() {
  return (
    <p>
      Map. <noscript>You need to enable JavaScript to see this map.</noscript>
    </p>
  );
}

const defaultFilter: markerFilter = {
  message: true,
  media: false,
  path: false,
  cast: false,
};

const Map = ({ posix = defaults.posix, zoom = defaults.zoom }: MapProps) => {
  const [filter, setFilter] = useState<markerFilter>(defaultFilter);

  return (
    <MapContainer
      zoom={zoom}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      center={posix}
      style={{ height: "100%", width: "100%" }}
      className="map-wrapper"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayerChoiceModal filter={filter} />
      <MinimapControl position="bottomright" zoom={5} />
      <div className="map-controls">
        <UserLocation />
        <AddMenu />
        <FilterMenu filterSetter={setFilter} />
      </div>
    </MapContainer>
  );
};

export default Map;