import { Movement } from '@app/model/Movement';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalVariant } from '@patternfly/react-core';
import React from 'react';

type ConfirmDeleteMovementProps = {
  movements: Movement[];
  onClose: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteMovementModal = ({ movements, onClose, onConfirm }: ConfirmDeleteMovementProps) => (
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
      ¿Estás segur@ que quieres eliminar el/los movimiento/s {movements.map((movement) => movement.name).join(', ')}? La
      acción no se puede deshacer.
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
