import { useEffect, useState } from "react";
import  L from "leaflet"
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { MinimapControl } from "./MinimapControl";
import { AddMenu } from "./Add";
import "../styles/Map.css";
import { UserLocation } from "./UserLocation";
import { LayerChoiceModal } from "./LayersControl";
import { layerType, markerFilter } from "./types";
import { FilterMenu } from "./MarkerFilter";
import { Config, UseAccountReturnType, useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { ReadContractErrorType } from "wagmi/actions";

// Set map bounds.
// Allow scroll over the international date line, so users can comfortably zoom into locations near the date line.
const corner1 = L.latLng(-90, -Infinity)
const corner2 = L.latLng(90, Infinity)
const bounds = L.latLngBounds(corner1, corner2)

interface MapProps {
  posix?: LatLngExpression | LatLngTuple;
  zoom?: number;
  account : UseAccountReturnType<Config>;
  mapRef : React.Dispatch<React.SetStateAction<L.Map | null>>; 
  layers : layerType[];
  error : ReadContractErrorType | null;
  refetch
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
  media: true,
  path: false,
  cast: false,
};

export const MainMap = ({ posix = [0,0], zoom = 4, account, mapRef, layers, error, refetch } : MapProps) => {
  const [filter, setFilter] = useState<markerFilter>(defaultFilter);

  return (
    <MapContainer
      zoom={zoom}
      placeholder={<MapPlaceholder />}
      center={posix}
      className="map-wrapper"
      worldCopyJump={true}
      ref={mapRef}
      maxBoundsViscosity={0.9}
      maxBounds={bounds}
      zoomSnap={0.25}
      minZoom={2}
    >
      <TileLayer
        maxNativeZoom={19}
        maxZoom={21}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LayerChoiceModal filter={filter} account={account} layers={layers} error={error} refetch={refetch}/>
      <MinimapControl position="bottomright" zoom={5} />
      <div className="map-controls">
        <UserLocation />
        <AddMenu layers={layers} error={error} address={account.address as string} refetch={refetch}/>
        <FilterMenu filterSetter={setFilter} />
      </div>
    </MapContainer>
  );
};
