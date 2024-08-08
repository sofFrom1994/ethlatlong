import React, { useEffect, useState } from "react";
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

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

const Map = ({ posix = [0,0], zoom = 4, account}: MapProps) => {
  const [filter, setFilter] = useState<markerFilter>(defaultFilter);
  const [layers, setLayers] = useState<layerType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const { data, error: readError } = useReadContract({
    abi,
    address: contract_address,
    functionName: "getAllLayers",
    blockTag: 'latest',
    query: {
      refetchInterval: 2000,
      staleTime:3000,
    }
  });

  useEffect(() => {
    if (readError) {
      setError(readError);
    } else {
      const uniqueLayers = data ? [...new Set(data)] : [];
      setLayers(uniqueLayers);
    }
  }, [data, readError]);

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
      <LayerChoiceModal filter={filter} account={account} layers={layers} error={error}/>
      <MinimapControl position="bottomright" zoom={5} />
      <div className="map-controls">
        <UserLocation />
        <AddMenu layers={layers} error={readError} />
        <FilterMenu filterSetter={setFilter} />
      </div>
    </MapContainer>
  );
};

export default Map;