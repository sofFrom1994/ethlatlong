import { useEffect, useState } from 'react';
import { useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { embedType, layerType, markerFilter } from './types';
import { embedToMarker } from './EmbedMarker';
const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const LayerChoiceModal = (props : { filter : markerFilter} ) => {
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

  useEffect(() => {
    if (readError) {
      setError(readError);
    } else {
      const uniqueLayers = data ? [...new Set(data)] : [];
      setLayers(uniqueLayers);
    }
  }, [data, readError]);

  if (error) {
    console.log(error);
    return <></>;
  } 

  if (!layers || layers.length === 0) return <></>;

  return (
    <LayersControl>
      {layers.map((layer) => layerToLayerControlOverlay(layer, props.filter))}
    </LayersControl>
  );
};

const embedFilter = (embed: embedType, filter: markerFilter) => {
  if (embed.kind === 0) {
    return filter.message;
  } else if (embed.kind === 1) {
    return filter.media;
  } else {
    return false;
  }
};

const layerToLayerControlOverlay = (layer: layerType, filter: markerFilter) => {
  return (
    <LayersControl.Overlay checked name={layer.name} key={layer.id.toString()}>
      <LayerGroup>
        {layer.embeds
          .filter((embed) => {
            return embedFilter(embed, filter);
          })
          .map((embed) => embedToMarker(layer, embed))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};