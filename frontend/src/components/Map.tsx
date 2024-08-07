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
import { Config, UseAccountReturnType } from "wagmi";

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
  account : UseAccountReturnType<Config>;
}

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

const Map = ({ posix = [0,0], zoom = 4, account}: MapProps) => {
  const [filter, setFilter] = useState<markerFilter>(defaultFilter);

  return (
    <MapContainer
      zoom={zoom}
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      center={posix}
      className="map-wrapper"
      worldCopyJump={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayerChoiceModal filter={filter} account={account} />
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