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
  console.log(svg);
  const htmlS = `<span style="color: ${color};">${svg}</span>`;
  console.log("html : \n\n");
  console.log(htmlS);
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
  return nColor.toString(16);
}

export const embedToMarker = (layer: layerType, embed : embedType) => {
  let embedIcon: L.Icon<L.IconOptions> | L.DivIcon ;
  //
  if (embed.kind === 0) {
    //embedIcon = messageIcon;
    embedIcon = messageDiv;
  } else if (embed.kind === 1) {
    console.log("path icon?");
    embedIcon = messageDiv;
  } else if (embed.kind === 2) {
    embedIcon = mediaIcon;
  } else {
    console.log("unknown icon");
    embedIcon = messageDiv;
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