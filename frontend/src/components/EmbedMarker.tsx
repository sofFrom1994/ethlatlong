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

const processMetadataURL = (dataUrl : string) => {
    try {
        // Split the data URL into metadata and data parts
        const [meta, data] = dataUrl.split(',');

        // Extract the content type and encoding from the metadata
        const metaParts = meta.split(';');
        const mimeType = metaParts[0].replace('data:', '');
        const encoding = metaParts[1];

        let decodedData: string;

        // Handle different encodings
        if (encoding === 'base64') {
            decodedData = atob(data);
        } else if (encoding === 'charset=utf-8') {
            decodedData = decodeURIComponent(data);
        } else {
            throw new Error(`Unsupported encoding: ${encoding}`);
        }

        // Handle different content types
        if (mimeType === 'application/json') {
            return JSON.parse(decodedData);
        } else if (mimeType.startsWith('text/')) {
            return decodedData; // Return as plain text
        } else {
            throw new Error(`Unsupported MIME type: ${mimeType}`);
        }
    } catch (error) {
        console.error("Error processing the data URL:", error);
        return "";
    }
}

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
  let embedMediaName : string = "";
  if (url.length > 0) {
    const result = processMetadataURL(url);
    if (result !== "") {
      const ipfsLink = result.image.replace("ipfs://", "https://ipfs.io/ipfs/");
      embedMediaName = result.name;
      embedMedia = () => { return (<img src={ipfsLink} loading="lazy"/> ); }
    }
  }

  let popupContent = null;

  if (embed.kind === 2) {
    popupContent = (
      <div className="post-popup-content">
        <p>
          {embedMediaName} {embed.message}
        </p>
        {embedMedia && embedMedia()}
      </div>
    );
  } else {
    popupContent = (
      <div className="post-popup-content">
        <p> {embed.message}</p>
      </div>
    );
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
            {popupContent}
          </div>
          <div className="post-popup-footer">
            by {embed.author.substring(0, 4)}...{embed.author.substring(38, 42)}
          </div>
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
        </Popup>
      </Marker>
    </Fragment>
  );
};
