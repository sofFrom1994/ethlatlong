import React, { useState } from 'react';
import { Button, Dialog, DialogTrigger, Heading, Menu, MenuItem, MenuTrigger, Modal, Popover } from 'react-aria-components';
import { AddMessageRA } from './AddMessageRA';
import { AddLayerRA } from './AddLayerRA';
import "../styles/Add.css";

// todo : add preview of the place in the map with the correct icon where the 
// user is posting.

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

export const AddMenu = () => {
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAction = (key: React.Key) => {
    if (key === "layer") {
      setModalContent(<AddLayerRA />);
    } else if (key === "message") {
      setModalContent(<AddMessageRA />);
    } else if (key === "media") {
      alert("Can't add media via UI yet");
    } else {
      console.log("Invalid choice: ", key);
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <MenuTrigger>
        <Button aria-label="Menu">
          <div className="plus">+</div>
        </Button>
        <Popover placement='top'>
          <Menu onAction={handleAction}>
            <MenuItem id="layer">Layer</MenuItem>
            <MenuItem id="message">Message</MenuItem>
            <MenuItem id="media">Media</MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
      {modalContent && (
        <AddModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          {modalContent}
        </AddModal>
      )}
    </>
  );
}