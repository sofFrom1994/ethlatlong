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

  const mlayers = layers;
  console.log(mlayers);

  return (
    <LayersControl>
      {mlayers.map((l) => layerToLayerControlOverlay(l))}
    </LayersControl>
  );
};

const layerToLayerControlOverlay = (l: {
  id: bigint;
  name: string;
  description: string;
  embedN: bigint;
  embeds: readonly {
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
    <LayersControl.Overlay name={l.name} key={l.id.toString()}>
      <LayerGroup>
        {l.embeds.map((em) => (
          <Marker key={`marker-${l.id.toString()}-${em.id.toString()}-${em.author}-${em.kind}-${em.message}`} position={[Number(em.lat), Number(em.long)]}>
            <Popup key={`popup-${l.id.toString()}-${em.id.toString()}-${em.author}-${em.kind}-${em.message}`}>
              {em.message}
              by
              {em.author}
            </Popup>
          </Marker>
        ))}
      </LayerGroup>
    </LayersControl.Overlay>
  );
};