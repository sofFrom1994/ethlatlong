import { useEffect, useState } from "react";
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
      scrollWheelZoom={false}
      placeholder={<MapPlaceholder />}
      center={posix}
      className="map-wrapper"
      worldCopyJump={true}
      ref={mapRef}
    >
      <TileLayer
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
