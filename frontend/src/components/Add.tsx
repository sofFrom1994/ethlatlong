import "../styles/Add.css"

import  { useState } from 'react';
import { Button, Dialog, DialogTrigger, Heading, Modal } from 'react-aria-components';
import { AddMessageRA } from './AddMessageRA';
import { AddLayerRA } from './AddLayerRA';

export const Add = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <Button>
        <div className="plus"> + </div>
      </Button>
      <Modal>
        <Dialog>
          <Heading>Add</Heading>
          <AddLayerRA />
          <AddMessageRA />
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}