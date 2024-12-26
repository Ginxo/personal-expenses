import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { MovementTypes } from '@app/model/MovementTypes';
import {
  Badge,
  Button,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalVariant,
} from '@patternfly/react-core';
import React from 'react';

type BulkMovementEditModalProps = {
  numberOfSelectedMovements: number;
  categories?: Category[];
  onSubmitCallback: ({ categoryId, type }: Partial<Pick<Movement, 'categoryId' | 'type'>>) => void;
  onCloseCallback: () => void;
};
const BulkMovementEditModal = ({
  numberOfSelectedMovements,
  categories,
  onSubmitCallback,
  onCloseCallback,
}: BulkMovementEditModalProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | undefined>(categories?.[0]?.id ?? '');
  const [selectedType, setSelectedType] = React.useState<Movement['type']>(MovementTypes[1]);
  return (
    <Modal
      isOpen
      variant={ModalVariant.small}
      onClose={onCloseCallback}
      onEscapePress={onCloseCallback}
      aria-labelledby="change-category-modal"
      aria-describedby="change-category-modal-with-dropdown"
      children={
        <>
          <ModalHeader title="Cambiar Categoría" labelId="modal-with-dropdown" />
          <ModalBody id="modal-box-body-with-dropdown">
            <p>
              Cambia la categoría y/o el tipo de múltiples movimientos <Badge isRead>{numberOfSelectedMovements}</Badge>
            </p>
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
                value={selectedType}
                onChange={(_e, value) => setSelectedType(value as Movement['type'])}
                aria-label="Type FormSelect Input"
                ouiaId="TypeFormSelect"
                children={MovementTypes.map((category, index) => (
                  <FormSelectOption key={index} value={category} label={category.toUpperCase()} />
                ))}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              key="confirm"
              variant="primary"
              onClick={() => {
                const selectedCategory = categories?.find((category) => category.id === selectedCategoryId);
                onSubmitCallback({ categoryId: selectedCategory?.id, type: selectedType });
                onCloseCallback();
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
  );
};

export { BulkMovementEditModal };
