import React, { useEffect, useState } from 'react';
import { useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";

const abi = ethLatLongAbi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const LayerChoiceModal = () => {
  const [layers, setLayers] = useState([]);
  const [error, setError] = useState(null);

  // useReadContract within the component render flow
  const { data, error: readError, refetch } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "getAllLayers",
  });

  useEffect(() => {
    if (readError) {
      setError(readError);
    } else {
      setLayers(data || []);
    }
  }, [data, readError]);

  useEffect(() => {
    const interval = setInterval(refetch, 3000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [refetch]);

  if (error) return <div>Error: {error.shortMessage || error.message}</div>;

  if (!layers || layers.length === 0) return <div>No layers available</div>;

  return (
    <LayersControl>
      {layers.map((layer) => layerToLayerControlOverlay(layer))}
    </LayersControl>
  );
};

const layerToLayerControlOverlay = (layer: {
  id: bigint;
  name: string;
  description: string;
  embedN: bigint;
  embeds: {
    id: bigint;
    kind: number;
    message: string;
    lat: bigint;
    long: bigint;
    author: `0x${string}`;
  }[];
  lat: bigint;
  long: bigint;
  author: `0x${string}`;
}) => {
  return (
    <LayersControl.Overlay name={layer.name} key={layer.id.toString()}>
      <LayerGroup>
        {layer.embeds.map((embed) => (
          <Marker
            key={`marker-${layer.id.toString()}-${embed.id.toString()}-${embed.author}-${embed.kind}-${embed.message}`}
            position={[
              Number(embed.lat) / 1e18,
              Number(embed.long) / 1e18,
            ] as LatLngExpression}
          >
            <Popup>
              {embed.message}
              <br />
              by {embed.author}
            </Popup>
          </Marker>
        ))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};
