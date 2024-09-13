import {
  Config,
  deserialize,
  UseAccountReturnType,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseWriteContractReturnType,
} from "wagmi";
import { LayerGroup, LayersControl, useMap } from "react-leaflet";
import { Map } from "leaflet";
import { embedType, layerType, markerFilter } from "./types";
import { EmbedMarker } from "./EmbedMarker";
import { Fragment } from "react";
import { AppendLayerControl } from "./AppendLayerControl";
import { parseUnits } from "viem";

export const EmbedLayerControl = (props: {
  filter: markerFilter;
  account: UseAccountReturnType<Config>;
  layers: layerType[];
  error: Error | null;
  refetch: () => void;
  dateRange: number[];
}) => {
  const map = useMap();
  const writeContractAction = useWriteContract();
  const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: writeContractAction.data,
  });

  if (isConfirmed) {
    props.refetch();
  }

  if (props.error) {
    console.log(props.error);
    return <></>;
  }

  if (!props.layers || props.layers.length === 0) return <></>;
  const layerViews = props.layers.map((layer) =>
    layerToLayerControlOverlay(
      layer,
      props.filter,
      props.account,
      writeContractAction,
      map,
      props.dateRange
    )
  );
  return (
    <>
      <LayersControl>{layerViews}</LayersControl>
      <AppendLayerControl layers={props.layers} />
    </>
  );
};

const embedFilter = (embed: embedType, filter: markerFilter, dateRange: number[]) => {
  const ets = Number(embed.timestamp) * 1000 ;
  if ((ets < dateRange[0]) || (ets > dateRange[1])) {
    return false;
  }
  if (embed.kind === 0) {
    return filter.message;
  } else if (embed.kind === 2) {
    return filter.media;
  } else {
    return false;
  }
};

const layerToLayerControlOverlay = (
  layer: layerType,
  filter: markerFilter,
  account: UseAccountReturnType<Config>,
  writeContract: UseWriteContractReturnType<Config, unknown>,
  map: Map,
  dateRange: number[]
) => {
  const markers = layer.embeds
    .filter((embed) => {
      return embedFilter(embed, filter, dateRange);
    })
    .map((embed) => EmbedMarker(layer, embed, account, writeContract, map));
  return (
    <Fragment key={`layer-${layer.id.toString()}`}>
      <LayersControl.Overlay checked name={layer.name}>
        <LayerGroup>{markers}</LayerGroup>
      </LayersControl.Overlay>
    </Fragment>
  );
};
