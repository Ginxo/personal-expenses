import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { MovementTypes } from '@app/model/MovementTypes';
import { User } from '@app/model/User';
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
  user: User;
  movement?: Partial<Movement>;
  categories?: Category[];
  onSubmitCallback: (movement: Movement) => void;
  onCloseCallback: () => void;
};
const CreateEditMovementModal = ({
  user,
  movement,
  categories,
  onSubmitCallback,
  onCloseCallback,
}: CreateEditMovementModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | undefined>();
  const [movementState, setMovementState] = React.useState<Movement>();

  React.useEffect(() => {
    setMovementState({
      date: dayjs.utc(new Date()).toISOString(),
      type: 'income',
    } as Movement);
    setSelectedCategoryId(categories?.[0]?.id ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (movement !== undefined && JSON.stringify(movement) !== JSON.stringify(movementState)) {
      setMovementState(movement as Movement);
      setSelectedCategoryId(movement?.categoryId ?? selectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movement, selectedCategoryId]);

  return movementState ? (
    <Modal
      isOpen
      variant={ModalVariant.small}
      onClose={onCloseCallback}
      onEscapePress={onCloseCallback}
      aria-labelledby="create-edit-movement-modal"
      aria-describedby="create-edit-movement-modal-with-dropdown"
      children={
        <>
          <ModalHeader title={`${movement?.id ? 'Editar' : 'Crear'} Movimiento`} labelId="modal-with-dropdown" />
          <ModalBody id="modal-box-body-with-dropdown">
            <FormGroup label="Fecha" fieldId="fecha">
              <DatePicker
                onChange={(_, _value, date) =>
                  setMovementState({
                    ...movementState,
                    date: date ? dayjs.utc(date).toISOString() : '',
                  })
                }
                onBlur={(_, _value, date) =>
                  setMovementState({
                    ...movementState,
                    date: date ? dayjs.utc(date).toISOString() : '',
                  })
                }
                value={dayjs.utc(movement?.date).format('YYYY-MM-DD')}
                aria-label="date"
              />
            </FormGroup>
            <br />
            <FormGroup label="Concepto" fieldId="name">
              <TextInput
                type="text"
                value={movementState.name}
                placeholder="Concepto"
                onChange={(_event, name) => setMovementState({ ...movementState, name })}
                aria-label="name"
              />
            </FormGroup>
            <br />
            <FormGroup label="Descripción" fieldId="description">
              <TextInput
                type="text"
                value={movementState.description}
                placeholder="Descripción"
                onChange={(_event, description) => setMovementState({ ...movementState, description })}
                aria-label="description"
              />
            </FormGroup>
            <br />
            <FormGroup label="Importe" fieldId="amount">
              <TextInput
                type="number"
                value={movementState.amount}
                placeholder="Importe"
                onChange={(_event, amount) =>
                  setMovementState({ ...movementState, amount: +amount, type: +amount >= 0 ? 'income' : 'expense' })
                }
                aria-label="amount to insert"
                min={-100000}
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
                children={categories?.map((category, index) => (
                  <FormSelectOption key={index} value={category.id} label={category.name.toUpperCase()} />
                ))}
              />
            </FormGroup>
            <br />
            <FormGroup label="Tipo" fieldId="tipo">
              <FormSelect
                value={movementState.type}
                onChange={(_event, type) =>
                  setMovementState({
                    ...movementState,
                    type: type as Movement['type'],
                  })
                }
                aria-label="Type FormSelect Input"
                ouiaId="TypeFormSelect"
                children={MovementTypes.map((type, index) => (
                  <FormSelectOption key={index} value={type} label={type.toUpperCase()} />
                ))}
              />
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
                    categoryId: category.id,
                    category,
                    user,
                    userId: user.id,
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
        </>
      }
    />
  ) : null;
};

export { CreateEditMovementModal };
