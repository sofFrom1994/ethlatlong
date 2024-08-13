import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button, Dialog, DialogTrigger, Menu, MenuItem, MenuTrigger, Modal, Popover } from 'react-aria-components';
import "../styles/Add.css";
import { AddLayerForm } from './AddLayerForm';
import { AddMessageForm } from './AddMessageForm';
import L, { LatLng } from 'leaflet';
import { Marker, Popup, useMap } from "react-leaflet";
import { layerType } from './types';
import { ReadContractErrorType } from 'wagmi/actions';
import { useAccount } from 'wagmi';
import { CloseButton } from './CloseButton';
import { coloredIcon } from '../utils';

import messageSVG from "../assets/message-outline.svg?raw";
import mapPlusSVG from "../assets/map-plus.svg?raw";
import mediaSVG from "../assets/photo.svg?raw";

//todo depending on kind of embed, use different add markers. 

const AddModal = ({ children, isOpen, onOpenChange }) => {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal isDismissable>
        <Dialog>
          {children}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

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
          Add content <button data-type="add" onClick={() => { markerRef.current.fire("dragend") }}>here</button> or
          drag this marker to your desired location.
        </span>
      </Popup>
    </Marker>
  );
}

export const AddMenu = (props: { layers : layerType[], error :  ReadContractErrorType | null}) => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requireMarkerPlacement, setRequireMarkerPlacement] = useState(false);
  const [icon, setIcon] = useState(coloredIcon("#0", mapPlusSVG));

  const map = useMap();
  const [position, setPosition] = useState<LatLng>(map.getCenter());

  const markerRef = useRef<L.Marker<any>>(null);
  const account = useAccount();

  const markerEventHandler = useMemo(() => ({
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
  }), [requireMarkerPlacement]);

  const handleAction = (key: React.Key) => {
    const currentCenter = map.getCenter();

    if (!account.isConnected) {
      setModalContent(
        <span style={{display: "grid", justifyContent: "center", gridAutoFlow: "row", gap: "0.6rem"}}>
          <p>
            Sign in first to post content.
          </p>
          <span style={{marginLeft: "4.5rem"}}>
          <CloseButton label="close" />
          </span>
        </span>
      );
      setIsModalOpen(true);
      setRequireMarkerPlacement(false);
      return;
    }
    if (key === "layer") {
      setIcon(coloredIcon("#0", mapPlusSVG, [20, 20], [10, -2]));
      setModalContent(
        <AddLayerForm lat={currentCenter.lat} long={currentCenter.lng} />
      );
      setRequireMarkerPlacement(true);
    } else if (key === "message") {
      setIcon(coloredIcon("#0", messageSVG, [20, 20], [10, -2]));
      setModalContent(
        <AddMessageForm
          lat={currentCenter.lat}
          long={currentCenter.lng}
          layers={props.layers}
          error={props.error}
        />
      );
      setRequireMarkerPlacement(true);
    } else if (key === "media") {
      setIcon(coloredIcon("#0", mediaSVG));
      let closeButtonStyle = {color: "white"}
      setModalContent(
        <span>
          <p> Media can only be embededed via smart contract at this moment. </p>
          <CloseButton label="Close" style={closeButtonStyle}/>
        </span>
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
        <Button style={{height: "94%", borderRadius: "1.5rem"}} aria-label="Menu" className="add">
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