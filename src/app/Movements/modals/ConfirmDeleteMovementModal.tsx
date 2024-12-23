import { Movement } from '@app/model/Movement';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React from 'react';

type ConfirmDeleteMovementProps = {
  movement: Movement;
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteMovementModal = ({ movement, onClose, onConfirm }: ConfirmDeleteMovementProps) => (
  <Modal
    isOpen
    onClose={onClose}
    ouiaId="BasicModal"
    aria-labelledby="basic-modal-title"
    aria-describedby="modal-box-body-basic"
    variant={ModalVariant.small}
  >
    <ModalHeader title="¿Estás Segur@?" labelId="basic-modal-title" />
    <ModalBody id="modal-box-body-basic">
      ¿Estás segur@ que quieres eliminar el movimiento {movement.name}? La acción no se puede deshacer.
    </ModalBody>
    <ModalFooter>
      <Button key="confirm" variant="primary" onClick={onConfirm}>
        Confirmar
      </Button>
      <Button key="cancel" variant="link" onClick={onClose}>
        Cancelar
      </Button>
    </ModalFooter>
  </Modal>
);

export { ConfirmDeleteMovementModal };
