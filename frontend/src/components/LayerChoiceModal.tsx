import { useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";

const abi = ethLatLongAbi;

export const LayerChoiceModal = () => {
  const { data: layers, error, isPending } = useReadContract({
    abi,
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    functionName: "getAllLayers",
  });

  if (isPending) return <div>Loading...</div>;

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
