import { useEffect, useState } from 'react';
import { useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { layerType } from './types';
import { embedToMarker } from './EmbedMarker';
const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const LayerChoiceModal = () => {
  const [layers, setLayers] = useState<layerType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // useReadContract within the component render flow
  const { data, error: readError } = useReadContract({
    abi,
    address: contract_address,
    functionName: "getAllLayers",
    blockTag: 'safe',
    query: {
      refetchInterval: 2000,
      staleTime:3000,
    }
  });

  console.log(layers);

  useEffect(() => {
    if (readError) {
      setError(readError);
    } else {
      const uniqueLayers = data ? [...new Set(data)] : [];
      setLayers(uniqueLayers);
    }
  }, [data, readError]);

  if (error) return <div>Error: {error.shortMessage || error.message}</div>;

  if (!layers || layers.length === 0) return <div>No layers available</div>;

  console.log(layers);

  return (
    <LayersControl>
      {layers.map((layer) => layerToLayerControlOverlay(layer))}
    </LayersControl>
  );
};

const layerToLayerControlOverlay = (layer: layerType) => {
  console.log(layer);
  return (
    <LayersControl.Overlay name={layer.name} key={layer.id.toString()}>
      <LayerGroup>
        {layer.embeds.map((embed) => (
          embedToMarker(layer, embed)
        ))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};