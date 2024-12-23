import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { User } from '@app/model/User';
import {
  Button,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  TextInput,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { MutationStatus } from '@tanstack/react-query';
import React from 'react';

type CategoriesSelectProps = {
  movement: Movement;
  movements?: Movement[];
  categories?: Category[];
  user: User;
  newCategory?: Category;
  postCategory: (category: Partial<Category>) => void;
  patchMovements: (movements: Movement[]) => void;
  patchStatus: MutationStatus;
  postCategoryStatus: MutationStatus;
  isUpdateDisabled: boolean;
};

const CategoriesSelect = ({
  movement,
  movements,
  categories,
  user,
  newCategory,
  postCategory,
  patchMovements,
  patchStatus,
  postCategoryStatus,
  isUpdateDisabled,
}: CategoriesSelectProps) => {
  const [openedCategories, setOpenedCategories] = React.useState<{ [id: string]: boolean }>();
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [filteredCategories, setFilteredCategories] = React.useState(categories);
  const [movementToUpdate, setMovementToUpdate] = React.useState<Movement>();

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, movement: Movement) => {
    switch (event.key) {
      case 'Enter':
        setMovementToUpdate(movement);
        postCategory({ name: newCategoryName, userId: user.id });
    }
  };

  React.useEffect(() => {
    if (newCategory && movementToUpdate) {
      patchMovements([
        {
          ...movementToUpdate,
          categoryId: newCategory.id,
          category: newCategory,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCategory]);

  React.useEffect(
    () =>
      setOpenedCategories(movements ? movements.reduce((acc, movement) => ({ ...acc, [movement.id]: false }), {}) : {}),
    [movements],
  );

  React.useEffect(() => {
    if (categories?.length) {
      setFilteredCategories(categories);
    }
  }, [categories]);

  return openedCategories !== undefined ? (
    <Select
      role="menu"
      id="edit-categories-select"
      isOpen={openedCategories?.[movement.id]}
      selected={movement.categoryId}
      onSelect={(_e, categoryId) => {
        setOpenedCategories({ ...openedCategories, [movement.id]: false });
        patchMovements([
          {
            ...movement,
            categoryId: categories?.find((c) => c.id === categoryId)?.id ?? movement.categoryId,
          },
        ]);
        setNewCategoryName('');
      }}
      onOpenChange={(nextOpen: boolean) => {
        setOpenedCategories({ ...openedCategories, [movement.id]: nextOpen });
        if (!nextOpen) {
          setFilteredCategories(categories);
          setNewCategoryName('');
        }
      }}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          variant="plainText"
          ref={toggleRef}
          onClick={() =>
            setOpenedCategories({
              ...openedCategories,
              [movement.id]: openedCategories?.[movement.id] === undefined ? true : !openedCategories?.[movement.id],
            })
          }
          isExpanded={openedCategories?.[movement.id]}
          style={{ width: '190px' }}
          isDisabled={isUpdateDisabled}
        >
          {movement.category ? movement.category.name.toUpperCase() : 'NO SELECCIONADA'}
        </MenuToggle>
      )}
    >
      <SelectList>
        <Flex style={{ padding: '1.5rem' }}>
          <FlexItem>
            <TextInput
              type="text"
              value={newCategoryName}
              placeholder={
                newCategoryName.trim().length === 0 || filteredCategories?.length
                  ? 'Filtrar Categorías'
                  : 'Nueva Categoría'
              }
              onChange={(_event, name) => {
                setNewCategoryName(name);
                setFilteredCategories(
                  categories?.filter((c) => c.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())),
                );
              }}
              aria-label="name"
              isDisabled={[postCategoryStatus, patchStatus].includes('pending')}
              onKeyDown={(event) => onInputKeyDown(event, movement)}
            />
          </FlexItem>
          <FlexItem>
            <Button
              variant="plain"
              aria-label="Action"
              icon={<CheckCircleIcon />}
              isDisabled={[postCategoryStatus, patchStatus].includes('pending')}
              onClick={() => {
                setMovementToUpdate(movement);
                postCategory({ name: newCategoryName, userId: user.id });
                setNewCategoryName('');
              }}
            />
          </FlexItem>
        </Flex>
        {filteredCategories?.map((category) => (
          <SelectOption
            isDisabled={isUpdateDisabled || category.id === movement.categoryId}
            key={category.id}
            value={category.id}
          >
            {category.name.toUpperCase()}
          </SelectOption>
        ))}
      </SelectList>
    </Select>
  ) : null;
};

export { CategoriesSelect };
