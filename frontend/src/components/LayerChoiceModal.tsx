import React, { useEffect, useState } from 'react';
import { useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";

import bubble from "../assets/bubble.svg";

import media from "../assets/photo.svg";
import farCastIcon from "../assets/purple-white.svg";

const abi = ethLatLongAbi;
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

type embedType = {
    id: bigint;
    kind: number;
    message: string;
    lat: bigint;
    long: bigint;
    author: `0x${string}`;
}

type layerType = {
  id: bigint;
  name: string;
  description: string;
  embedN: bigint;
  embeds: embedType[];
  lat: bigint;
  long: bigint;
  author: `0x${string}`;
  color: number;
}

//todo: change to location and add location to button too
const messageIcon = L.icon({
  iconUrl: bubble,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
  //className: "markerColor"
});

const mediaIcon = L.icon({
  iconUrl: media,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
  //className: "markerColor"
});

const farCast = L.icon({
  iconUrl: farCastIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
  //className: "markerColor"
})

export const LayerChoiceModal = () => {
  const [layers, setLayers] = useState([]);
  const [error, setError] = useState(null);

  // useReadContract within the component render flow
  const { data, error: readError, refetch } = useReadContract({
    abi,
    address: CONTRACT_ADDRESS,
    functionName: "getAllLayers",
  });

  console.log(layers);

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

const nToColor = (nColor : number) => {
  return nColor.toString(16);
}

const embedToMarker = (layer: layerType, embed : embedType) => {
  let embedIcon: L.Icon<L.IconOptions>;
  //
  if (embed.kind === 0) {
    embedIcon = messageIcon;
  } else if (embed.kind === 1) {
    console.log("path icon?");
    embedIcon = messageIcon;
  } else if (embed.kind === 2) {
    embedIcon = mediaIcon;
  } else {
    console.log("unknown icon");
    embedIcon = messageIcon;
  }

  const markerColor = nToColor(layer.color);

  return (
    <div style={{color: markerColor}}>
      <Marker
        key={`marker-${layer.id.toString()}-${embed.id.toString()}-${embed.author}-${embed.kind}-${embed.message}`}
        position={
          [
            Number(embed.lat) / 1e18,
            Number(embed.long) / 1e18,
          ] as LatLngExpression
        }
        icon={embedIcon}
      >
        <Popup>
          {embed.message}
          <br />
          by {embed.author}
        </Popup>
      </Marker>
    </div>
  );
}


const layerToLayerControlOverlay = (layer: layerType) => {
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
