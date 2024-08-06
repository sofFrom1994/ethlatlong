import { Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";

import messageSVG from "../assets/message-outline.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";
import { Color, embedType, layerType } from './types';
import { coloredIcon } from '../utils';
import { Config, UseAccountReturnType } from "wagmi";
import { ethLatLongAbi } from "../generated";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

const nToColor = (nColor : number) => {
  return nColor.toString(16) as Color;
}

export const embedToMarker = (layer: layerType, embed : embedType,  account: UseAccountReturnType<Config> ) => {
  const markerColor = nToColor(layer.color);
  const deleteMarker = () => {
    console.log("removing message...");
    /*
    writeContract({
      address: contract_address,
      abi,
      functionName: "removeMessage",
      args: [layer.name, embed.id],
    });
    */
  }

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

  let deleteButton = null;
  if (account.isConnected) {
    console.log("account connected");
    if (String(account.address) === embed.author) {
      console.log("same author");
      deleteButton = () => {
        return (
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => deleteMarker()}
          >
            Delete
          </button>
        );
      };
    }
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
        {deleteButton && deleteButton()}
        </Popup>
      </Marker>
    </div>
  );
}