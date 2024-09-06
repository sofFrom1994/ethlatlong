import {
  Config,
  UseAccountReturnType,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseWriteContractReturnType,
} from "wagmi";
import { LayerGroup, LayersControl, useMap } from "react-leaflet";
import { Map } from "leaflet";
import { embedType, layerType, markerFilter } from "./types";
import { EmbedMarker } from "./EmbedMarker";
import { Fragment, useState } from "react";
import AppendLayerControl from "./AppendLayerControl";
import CheckboxHandler from "./CheckBoxHandler";

export const LayerChoiceModal = (props: {
  filter: markerFilter;
  account: UseAccountReturnType<Config>;
  layers: layerType[];
  error: Error | null;
  refetch;
}) => {
  const [checkedLayers, setCheckedLayers] = useState<string[]>([]);
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
      props.refetch, 
      checkedLayers
    )
  );
  return (
    <>
      <LayersControl>{layerViews}</LayersControl>
      <AppendLayerControl layers={props.layers} />
      <CheckboxHandler checkedSetter={setCheckedLayers}/> 
    </>
  );
};

const embedFilter = (embed: embedType, filter: markerFilter) => {
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
  refetch,
  checkedLayers : string[]
) => {
  const isChecked = checkedLayers.includes(layer.name);

  const markers = layer.embeds
    .filter((embed) => {
      return embedFilter(embed, filter);
    })
    .map((embed) =>
      EmbedMarker(layer, embed, account, writeContract, map, refetch)
    );
  return (
    <Fragment key={`layer-${layer.id.toString()}`}>
      <LayersControl.Overlay checked={isChecked} name={layer.name}>
        <LayerGroup>{markers}</LayerGroup>
      </LayersControl.Overlay>
    </Fragment>
  );
};
