import { Config, UseAccountReturnType,  useWriteContract, UseWriteContractReturnType } from "wagmi";
import { LayerGroup, LayersControl } from "react-leaflet";
import { embedType, layerType, markerFilter } from './types';
import { embedToMarker } from './EmbedMarker';
import { Fragment } from "react";

export const LayerChoiceModal = (props : { filter : markerFilter, account : UseAccountReturnType<Config>, layers : layerType[], error : Error | null} ) => {
  const writeContractAction  = useWriteContract();

  if (props.error) {
    console.log(props.error);
    return <></>;
  } 

  if (!props.layers || props.layers.length === 0) return <></>;
  const layerViews = props.layers.map((layer) => layerToLayerControlOverlay(layer, props.filter, props.account, writeContractAction));
  return (
    <LayersControl>
      {layerViews}
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

const layerToLayerControlOverlay = (layer: layerType, filter: markerFilter, account : UseAccountReturnType<Config>, writeContract : UseWriteContractReturnType<Config, unknown>) => {
  const markers = layer.embeds
    .filter((embed) => {
      return embedFilter(embed, filter);
    })
    .map((embed) => embedToMarker(layer, embed, account, writeContract));
  return (
    <Fragment
      key={`layer-${layer.id.toString()}`}
    >
      <LayersControl.Overlay checked name={layer.name}>
        <LayerGroup>{markers}</LayerGroup>
      </LayersControl.Overlay>
    </Fragment>
  );
};