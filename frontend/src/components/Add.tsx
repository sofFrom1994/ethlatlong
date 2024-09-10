import "../styles/Add.css";

import messageSVG from "../assets/bubble-plus.svg?raw";
import mapPlusSVG from "../assets/map-plus.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  Popover,
} from "react-aria-components";
import { AddLayerForm } from "./AddLayerForm";
import { AddMessageForm } from "./AddMessageForm";
import L, { LatLng } from "leaflet";
import { Marker, Popup, useMap } from "react-leaflet";
import { layerType } from "./types";
import { ReadContractErrorType } from "wagmi/actions";
import { useAccount } from "wagmi";
import { CloseButton } from "./CloseButton";
import { coloredIcon } from "../utils";

import { AddMediaForm } from "./AddMediaForm";

const disabledMediaAdd = () => {
  let closeButtonStyle = { color: "white" };
  return (
    <span>
      <p> Media can only be embededed via smart contract at this moment. </p>
      <CloseButton label="Close" style={closeButtonStyle} />
    </span>
  );
};

const AddModal = ({ children, isOpen, onOpenChange }) => {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal isDismissable>
        <Dialog>{children}</Dialog>
      </Modal>
    </DialogTrigger>
  );
};

const AddMarker = ({ eventHandlers, position, markerRef, icon }) => {
  useEffect(() => {
    markerRef.current.openPopup();
  }, []);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={icon}
    >
      <Popup minWidth={90}>
        <span>
          Add content{" "}
          <button
            data-type="add"
            onClick={() => {
              markerRef.current.fire("dragend");
            }}
          >
            here
          </button>{" "}
          or drag this marker to your desired location.
        </span>
      </Popup>
    </Marker>
  );
};

export const AddMenu = (props: {
  layers: layerType[];
  error: ReadContractErrorType | null;
  address: string;
  refetch;
}) => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requireMarkerPlacement, setRequireMarkerPlacement] = useState(false);
  const [icon, setIcon] = useState(coloredIcon("#0", mapPlusSVG));

  const map = useMap();
  const [position, setPosition] = useState<LatLng>(map.getCenter());

  const markerRef = useRef<L.Marker<any>>(null);
  const account = useAccount();

  const markerEventHandler = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const wrappedPos = marker.getLatLng().wrap();
          setPosition(wrappedPos);
          if (requireMarkerPlacement) {
            setRequireMarkerPlacement(false);
            setIsModalOpen(true);
          }
        }
      },
    }),
    [requireMarkerPlacement]
  );

  const handleAction = (key: React.Key) => {
    const currentCenter = map.getCenter();

    if (!account.isConnected) {
      setModalContent(
        <span
          style={{
            display: "grid",
            justifyContent: "center",
            gridAutoFlow: "row",
            gap: "0.6rem",
          }}
        >
          <p>Sign in first to post content.</p>
          <span style={{ marginLeft: "4.5rem" }}>
            <CloseButton label="close" />
          </span>
        </span>
      );
      setIsModalOpen(true);
      setRequireMarkerPlacement(false);
      return;
    }
    if (key === "layer") {
      setIcon(
        coloredIcon("000000", mapPlusSVG, undefined, [10, -20], 1, [0, 20])
      );
      setModalContent(
        <AddLayerForm
          lat={currentCenter.lat}
          long={currentCenter.lng}
          refetch={props.refetch}
        />
      );
      setRequireMarkerPlacement(true);
    } else if (key === "message") {
      setIcon(
        coloredIcon("000000", messageSVG, undefined, [10, -20], 1, [0, 20])
      );
      setModalContent(
        <AddMessageForm
          lat={currentCenter.lat}
          long={currentCenter.lng}
          layers={props.layers}
          error={props.error}
          refetch={props.refetch}
        />
      );
      setRequireMarkerPlacement(true);
    } else if (key === "media") {
      setIcon(coloredIcon("000000", mediaSVG));
      setModalContent(
        <AddMediaForm
          lat={currentCenter.lat}
          long={currentCenter.lng}
          layers={props.layers}
          error={props.error}
          address={props.address}
          refetch={props.refetch}
        />
      );
      setIsModalOpen(true);
      setRequireMarkerPlacement(false);
    } else {
      console.log("Invalid choice: ", key);
      return;
    }
    setPosition(currentCenter);
  };

  return (
    <>
      <MenuTrigger>
        <Button
          aria-label="Menu"
          className="add"
        >
          +
        </Button>
        <Popover placement="top">
          <Menu onAction={handleAction}>
            <MenuItem id="layer">Layer</MenuItem>
            <MenuItem id="message">Message</MenuItem>
            <MenuItem id="media">Media</MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
      {requireMarkerPlacement && (
        <AddMarker
          eventHandlers={markerEventHandler}
          position={position}
          markerRef={markerRef}
          icon={icon}
        />
      )}
      {modalContent && (
        <AddModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          {modalContent}
        </AddModal>
      )}
    </>
  );
};
