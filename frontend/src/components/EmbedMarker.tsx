import React, { useEffect, useState } from 'react';
import { useReadContract } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { LayerGroup, LayersControl, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";

import messageSVG from "../assets/message-outline.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";
import farCastIcon from "../assets/purple-white.svg";
import { Color, embedType, layerType } from './types';

const coloredIcon = (color: Color, svg: string) => {
  const htmlS = `<span style="color: ${color};">${svg}</span>`;
  return L.divIcon({
    iconUrl: svg,
    className: "emptyDummy",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    html: htmlS
  });
}

const messageDiv = coloredIcon("#12F", messageSVG); 
const mediaIcon = coloredIcon("#F2F", mediaSVG); 

const farCast = L.icon({
  iconUrl: farCastIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
  //className: "markerColor"
})


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
    embedIcon = mediaIcon;
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