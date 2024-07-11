import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Button, Dialog, DialogTrigger, Heading, Menu, MenuItem, MenuTrigger, Modal, Popover } from 'react-aria-components';
import "../styles/Add.css";
import { AddLayerForm } from './AddLayerForm';
import { AddMessageForm } from './AddMessageForm';
import L, { LatLng } from 'leaflet';
import { Marker, Popup, useMap } from "react-leaflet";

const AddModal = ({ children, isOpen, onOpenChange }) => {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal isDismissable>
        <Dialog>
          <Heading>Add</Heading>
          {children}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}

export const DraggableMarker = ({ draggable, eventHandlers, position, markerRef, toggleDraggable }) => {
  return (
    <Marker
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}>
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

export const AddMenu = () => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requireMarkerPlacement, setRequireMarkerPlacement] = useState(false);
  const map = useMap();

  // add marker
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

  // menu handler
  const handleAction = (key: React.Key) => {
    if (key === "layer") {
      setModalContent(<AddLayerForm lat={position.lat} long={position.lng}/>);
    } else if (key === "message") {
      setModalContent(<AddMessageForm lat={position.lat} long={position.lng}/>);
    } else if (key === "media") {
      alert("Can't add media via UI yet. only via smart contract atm.");
      return;
    } else {
      console.log("Invalid choice: ", key);
      return;
    }
    setRequireMarkerPlacement(true);
  };

  return (
    <>
      <MenuTrigger>
        <Button aria-label="Menu">
          <div className="plus">+</div>
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
        <DraggableMarker
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