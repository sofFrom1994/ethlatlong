import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Button, Dialog, DialogTrigger, Heading, Menu, MenuItem, MenuTrigger, Modal, Popover } from 'react-aria-components';
import "../styles/Add.css";
import { AddLayerForm } from './AddLayerForm';
import { AddMessageForm } from './AddMessageForm';
import L, { LatLng } from 'leaflet';
import { Marker, Popup, useMap } from "react-leaflet";
import mapPlus from "../assets/map-plus.svg";
import { layerType } from './types';
import { ReadContractErrorType } from 'wagmi/actions';

//todo depending on kind of embed, use different add markers. 

const addToMap = L.icon({
  iconUrl: mapPlus,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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

// todo: use the appropriate icon for each add
const DraggableMarker = ({ draggable, eventHandlers, position, markerRef, toggleDraggable }) => {
  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={addToMap}>
      
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? 'Marker is draggable'
            : 'Click here to make marker draggable'}
        </span>
      </Popup>
    </Marker>
  );
}

const AddMarker = ({ draggable, eventHandlers, position, markerRef, toggleDraggable }) => {
  useEffect(() => {
    markerRef.current.openPopup();
  }, []);

  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={addToMap}
    >
      <Popup minWidth={90}>
        <span>
          Add content <button onClick={() => { console.log("here"); markerRef.current.fire("dragend") }}>here</button> or
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
  const map = useMap();

  const [draggable, setDraggable] = useState(true);
  const [position, setPosition] = useState<LatLng>(map.getCenter());
  const markerRef = useRef<L.Marker<any>>(null);

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

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  const handleAction = (key: React.Key) => {
    const currentCenter = map.getCenter();
    if (key === "layer") {
      setModalContent(
        <AddLayerForm lat={currentCenter.lat} long={currentCenter.lng} />
      );
      setRequireMarkerPlacement(true);
    } else if (key === "message") {
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
      setModalContent(
        <p> Media can only be embededed via smart contract at this moment. </p>
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
        <Button aria-label="Menu" className="add">
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
          draggable={draggable}
          eventHandlers={markerEventHandler}
          position={position}
          markerRef={markerRef}
          toggleDraggable={toggleDraggable}
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