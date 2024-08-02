import { Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";

import messageSVG from "../assets/message-outline.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";
import { Color, embedType, layerType } from './types';
import { coloredIcon } from '../utils';

const nToColor = (nColor : number) => {
  return nColor.toString(16) as Color;
}

export const embedToMarker = (layer: layerType, embed : embedType) => {
  const markerColor = nToColor(layer.color);
  let embedIcon: L.Icon<L.IconOptions> | L.DivIcon ;
  //
  if (embed.kind === 0) {
    embedIcon = coloredIcon(markerColor, messageSVG);
  } else if (embed.kind === 1) {
    // todo: path icon
    embedIcon = coloredIcon(markerColor, messageSVG);
  } else if (embed.kind === 2) {
    embedIcon = coloredIcon(markerColor, mediaSVG);
  } else {
    // unknown marker
    embedIcon = coloredIcon(markerColor, messageSVG);
  }

  return (
    <div>
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