import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { MovementTypes } from '@app/model/MovementTypes';
import {
  Button,
  DatePicker,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import dayjs from 'dayjs';
import React from 'react';

type CreateEditMovementModalProps = {
  movement?: Partial<Movement>;
  categories?: Category[];
  onSubmitCallback: (movement: Movement) => void;
  onCloseCallback: () => void;
};
const CreateEditMovementModal = ({
  movement = {
    attributes: {
      date: new Date().getTime(),
      type: 'income',
    } as Movement['attributes'],
  },
  categories,
  onSubmitCallback,
  onCloseCallback,
}: CreateEditMovementModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | undefined>(categories?.[0]?.id ?? '');
  const [movementState, setMovementState] = React.useState<Movement>({ ...(movement as Movement) });
  return (
    <Modal
      isOpen
      variant={ModalVariant.small}
      onClose={onCloseCallback}
      onEscapePress={onCloseCallback}
      aria-labelledby="create-edit-movement-modal"
      aria-describedby="create-edit-movement-modal-with-dropdown"
    >
      <ModalHeader title={`${movement.id ? 'Editar' : 'Crear'} Movimiento`} labelId="modal-with-dropdown" />
      <ModalBody id="modal-box-body-with-dropdown">
        <FormGroup label="Fecha" fieldId="fecha">
          <DatePicker
            onChange={(_, _value, date) =>
              setMovementState({
                ...movementState,
                attributes: { ...movementState.attributes, date: date ? date.getTime() : 0 },
              })
            }
            onBlur={(_, _value, date) =>
              setMovementState({
                ...movementState,
                attributes: { ...movementState.attributes, date: date ? date.getTime() : 0 },
              })
            }
            value={dayjs.utc(movement.attributes?.date).format('YYYY-MM-DD')}
          />
        </FormGroup>
        <br />
        <FormGroup label="Concepto" fieldId="name">
          <TextInput
            type="text"
            value={movementState.attributes.name}
            placeholder="Concepto"
            onChange={(_event, name) =>
              setMovementState({ ...movementState, attributes: { ...movementState.attributes, name } })
            }
          />
        </FormGroup>
        <br />
        <FormGroup label="Descripción" fieldId="description">
          <TextInput
            type="text"
            value={movementState.attributes.description}
            placeholder="Descripción"
            onChange={(_event, description) =>
              setMovementState({ ...movementState, attributes: { ...movementState.attributes, description } })
            }
          />
        </FormGroup>
        <br />
        <FormGroup label="Importe" fieldId="amount">
          <TextInput
            type="number"
            value={movementState.attributes.amount}
            placeholder="Importe"
            onChange={(_event, amount) =>
              setMovementState({ ...movementState, attributes: { ...movementState.attributes, amount: +amount } })
            }
            aria-label="amount to insert"
            min={0}
            max={100000}
          />
        </FormGroup>
        <br />
        <FormGroup label="Categoría" fieldId="category">
          <FormSelect
            value={selectedCategoryId}
            onChange={(_e, value) => setSelectedCategoryId(categories?.find((c) => c.id === value)?.id)}
            aria-label="Category FormSelect Input"
            ouiaId="CategoryFormSelect"
          >
            {categories?.map((category, index) => (
              <FormSelectOption key={index} value={category.id} label={category.attributes.name} />
            ))}
          </FormSelect>
        </FormGroup>
        <br />
        <FormGroup label="Typo" fieldId="tipo">
          <FormSelect
            value={movementState.attributes.type}
            onChange={(_event, type) =>
              setMovementState({
                ...movementState,
                attributes: { ...movementState.attributes, type: type as Movement['attributes']['type'] },
              })
            }
            aria-label="Type FormSelect Input"
            ouiaId="TypeFormSelect"
          >
            {MovementTypes.map((category, index) => (
              <FormSelectOption key={index} value={category} label={category} />
            ))}
          </FormSelect>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          key="confirm"
          variant="primary"
          onClick={() => {
            const category = categories?.find((category) => category.id === selectedCategoryId);
            if (category) {
              onSubmitCallback({
                ...movementState,
                attributes: { ...movementState.attributes, categoryId: category.id },
              });
              onCloseCallback();
            }
          }}
        >
          Confirm
        </Button>
        <Button key="cancel" variant="link" onClick={onCloseCallback}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export { CreateEditMovementModal };
