import { Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import L from "leaflet";

import messageSVG from "../assets/message-outline.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";
import { Color, embedType, layerType } from "./types";
import { coloredIcon, nToColor } from "../utils";
import { Config, UseAccountReturnType, UseWriteContractReturnType } from "wagmi";
import { ethLatLongAbi } from "../generated";
import { Fragment } from "react";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

export const embedToMarker = (
  layer: layerType,
  embed: embedType,
  account: UseAccountReturnType<Config>,
  writeContractAction : UseWriteContractReturnType<Config, unknown>
) => {
  const markerColor = nToColor(layer.color);

  const deleteMarker = () => {
    writeContractAction.writeContract({
      address: contract_address,
      abi,
      functionName: "removeMessage",
      args: [layer.name, embed.id],
    });
  };

  let embedIcon: L.Icon<L.IconOptions> | L.DivIcon;
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
    if (String(account.address) === embed.author) {
      deleteButton = () => {
        return <button data-type="delete" onClick={() => deleteMarker()}>Delete</button>;
      };
    }
  }
  return (
    <Fragment key={`marker-${layer.id.toString()}-${embed.id.toString()}`}>
      <Marker
        position={
          [
            Number(embed.lat) / 1e18,
            Number(embed.long) / 1e18,
          ] as LatLngExpression
        }
        icon={embedIcon}
      >
        <Popup>
          <div>
            {embed.message}
            <br />
            by
            <br />
            {embed.author}
          </div>
          {deleteButton && deleteButton()}
          {

          /*
          {isConfirming && <div> Waiting for confirmation... </div>}
          {isConfirmed && (
            <div>
              {" "}
              Transaction confirmed. Message should stop appearing soon.
            </div>
          )}
          {error && (
            <div>
              {" "}
              Error: {(error as BaseError).shortMessage || error.message}
            </div>
          )}
            */
          }
        </Popup>
      </Marker>
    </Fragment>
  );
};
