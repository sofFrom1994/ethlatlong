import { Marker, Popup } from "react-leaflet";
import { Map, LatLngExpression } from "leaflet";
import L from "leaflet";

import messageSVG from "../assets/bubble.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";
import { Color, embedType, layerType } from "./types";
import { coloredIcon, nToColor } from "../utils";
import {
  BaseError,
  Config,
  UseAccountReturnType,
  UseWriteContractReturnType,
} from "wagmi";
import { ethLatLongAbi } from "../generated";
import { Fragment, ReactNode } from "react";
import { ColorSwatch } from "react-aria-components";

const abi = ethLatLongAbi;
const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;

const colorSwatchStyle = {
  borderRadius: "0.2rem",
  height: "90%",
  width: "90%",
};

export const EmbedMarker = (
  layer: layerType,
  embed: embedType,
  account: UseAccountReturnType<Config>,
  writeContractAction: UseWriteContractReturnType<Config, unknown>,
  map: Map
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
  let url = "";
  //
  if (embed.kind === 0) {
    embedIcon = coloredIcon(
      markerColor,
      messageSVG,
      undefined,
      undefined,
      undefined,
      undefined
    );
  } else if (embed.kind === 1) {
    // todo: path icon
    embedIcon = coloredIcon(
      markerColor,
      messageSVG,
      undefined,
      undefined,
      undefined,
      undefined
    );
  } else if (embed.kind === 2) {
    console.log(embed);
    embedIcon = coloredIcon(
      markerColor,
      mediaSVG,
      undefined,
      undefined,
      undefined,
      undefined
    );
    url = embed.url;
  } else {
    // unknown marker
    embedIcon = coloredIcon(
      markerColor,
      messageSVG,
      undefined,
      undefined,
      undefined,
      undefined
    );
  }

  let deleteButton = null;
  if (account.isConnected) {
    if (String(account.address) === embed.author) {
      deleteButton = () => {
        return (
          <button data-type="delete" onClick={() => deleteMarker()}>
            Delete
          </button>
        );
      };
    }
  }

  const layerColor = `#${nToColor(layer.color)}`;
  let embedMedia = null;
  if (url.length > 0) {
    console.log(url);
    embedMedia = () => { return ( <img src={url} width={48} height={48} loading="lazy"/> )}
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
        eventHandlers={{
          dblclick: (e) => {
            map.flyTo(e.latlng, 18);
          },
        }}
      >
        <Popup minWidth={100}>
          <div className="popup-post">
            <div className="post-popup-header">
              <ColorSwatch style={colorSwatchStyle} color={layerColor} />
              <div>{layer.name}</div>
            </div>
            <div className="post-popup-content">
              <p>{embed.message}</p>
              {embedMedia && embedMedia()}
            </div>
            <div className="post-popup-footer">by {embed.author.substring(0,4)}...{embed.author.substring(38, 42)}</div>
            {deleteButton && deleteButton()}
            {writeContractAction.isPending && (
              <div> Waiting for confirmation... </div>
            )}
            {writeContractAction.isSuccess && (
              <div>
                {" "}
                Transaction confirmed. Message should stop appearing soon.
              </div>
            )}
            {writeContractAction.isError && (
              <div>
                {" "}
                Error:{" "}
                {(writeContractAction.error as BaseError).shortMessage ||
                  writeContractAction.error.message}
              </div>
            )}
          </div>
        </Popup>
      </Marker>
    </Fragment>
  );
};
