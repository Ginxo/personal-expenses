import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import {
  Button,
  Icon,
  MenuToggle,
  MenuToggleElement,
  Pagination,
  PaginationVariant,
  Select,
  SelectList,
  SelectOption,
  Timestamp,
  Tooltip,
} from '@patternfly/react-core';
import { MinusCircleIcon, PencilAltIcon, PlusCircleIcon, TrashIcon } from '@patternfly/react-icons';
import { Table, TableVariant, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import { MutationStatus, QueryStatus } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { BulkLoadMovementModal } from '../modals/BulkLoadMovementModal';
import { BulkMovementEditModal } from '../modals/BulkMovementEditModal';
import { CreateEditMovementModal } from '../modals/CreateEditMovementModal';
import { MovementsTableSkeleton } from './MovementsTableSkeleton';
import { MovementsTableToolbar } from './MovementsTableToolbar';

type MovementsTableProps = {
  movements?: Movement[];
  categories?: Category[];
  total?: number;
  queryStatus: QueryStatus;
  patchStatus: MutationStatus;
  bulkMovementsStatus: MutationStatus;
  movementsQuery: MovementsQuery;
  queryChangeCallback?: (query: MovementsQuery) => void;
  refetchMovementsCallback: () => void;
  patchMovements: (movements: Movement[]) => void;
  postMovement: (movement: Partial<Movement>) => void;
  deleteMovement: (id: string) => void;
  bulkMovements: (movements: Movement[]) => void;
};

const MovementsTable = ({
  movements,
  categories,
  total,
  queryStatus,
  patchStatus,
  bulkMovementsStatus,
  movementsQuery,
  queryChangeCallback,
  refetchMovementsCallback,
  patchMovements,
  postMovement,
  deleteMovement,
  bulkMovements,
}: MovementsTableProps) => {
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>();
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>();
  const [queryState, setQueryState] = React.useState<MovementsQuery>(movementsQuery);

  const [selectedMovements, setSelectedMovements] = React.useState<Movement[]>([]);
  const [shifting, setShifting] = React.useState(false);
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<number | null>(null);
  const isAnyRowSelected = selectedMovements.length > 0;
  const areAllRowsSelected = selectedMovements.length === movements?.length;

  const [isBulkLoadModalOpen, setIsBulkLoadModalOpen] = React.useState(false);
  const [isBulkMovementEditModalOpen, setIsBulkMovementModalOpen] = React.useState(false);
  const [isCreateMovementModalOpen, setIsCreateMovementModalOpen] = React.useState(false);

  const [openedCategories, setOpenedCategories] = React.useState<{ [id: string]: boolean }>();

  const isUpdateDisabled = useMemo(() => ![queryStatus, patchStatus].includes('success'), [patchStatus, queryStatus]);

  React.useEffect(() => {
    if (queryChangeCallback && JSON.stringify(movementsQuery) !== JSON.stringify(queryState)) {
      queryChangeCallback(queryState);
    }
    // avoid reaction on pagination
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState, queryChangeCallback]);

  React.useEffect(() => {
    setQueryState(movementsQuery);
  }, [movementsQuery, setQueryState]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShifting(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  React.useEffect(
    () =>
      setOpenedCategories(movements ? movements.reduce((acc, movement) => ({ ...acc, [movement.id]: false }), {}) : {}),
    [movements],
  );

  const getSortParams = (columnIndex: number, order_by: string): ThProps['sort'] => ({
    sortBy: {
      index: activeSortIndex,
      direction: activeSortDirection,
    },
    onSort: (_event, index, direction) => {
      setActiveSortIndex(index);
      setActiveSortDirection(direction as 'desc' | 'asc');
      setQueryState({ ...queryState, order_by, direction: direction as 'desc' | 'asc' });
    },
    columnIndex,
  });

  const isRowSelected = (movement: Movement) => selectedMovements.find((e) => e.id === movement.id) !== undefined;

  const setRowSelected = (movement: Movement, isSelecting = true) =>
    setSelectedMovements((prevSelected) => {
      const otherSelectedRows: Movement[] = prevSelected.filter((r) => r.id !== movement.id);
      return isSelecting ? [...otherSelectedRows, movement] : otherSelectedRows;
    });

  const onSelectRepo = (movement: Movement, rowIndex: number, isSelecting: boolean) => {
    // If the user is shift + selecting the checkboxes, then all intermediate checkboxes should be selected
    if (movements && shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes =
        numberSelected > 0
          ? Array.from(new Array(numberSelected + 1), (_x, i) => i + recentSelectedRowIndex)
          : Array.from(new Array(Math.abs(numberSelected) + 1), (_x, i) => i + rowIndex);
      intermediateIndexes.forEach((index) => setRowSelected(movements[index], isSelecting));
    } else {
      setRowSelected(movement, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
  };

  const selectAllRepos = (isSelecting = true) => setSelectedMovements(isSelecting && movements ? movements : []);

  return (
    <>
      <MovementsTableToolbar
        query={queryState}
        queryChangeCallback={(query) => setQueryState({ ...queryState, ...query })}
        disabled={isUpdateDisabled}
        categories={categories}
        createMovementCallback={() => setIsCreateMovementModalOpen(true)}
        refetchMovementsCallback={refetchMovementsCallback}
        bulkLoadCallback={() => setIsBulkLoadModalOpen(true)}
      />
      {(() => {
        switch (true) {
          case [patchStatus, queryStatus].includes('pending'):
            return <MovementsTableSkeleton />;
          case [patchStatus, queryStatus].includes('error'):
            return <p>Error</p>;
          default:
            return (
              <>
                <Table aria-label="Sortable table for movements" variant={TableVariant.compact}>
                  <Thead>
                    <Tr>
                      <Th
                        select={{
                          onSelect: (_event, isSelecting) => selectAllRepos(isSelecting),
                          isSelected: areAllRowsSelected,
                        }}
                        aria-label="Row select"
                      />
                      <Th sort={getSortParams(0, 'date')}>Fecha</Th>
                      <Th sort={getSortParams(1, 'name')}>Concepto</Th>
                      <Th sort={getSortParams(2, 'amount')}>Importe</Th>
                      <Th sort={getSortParams(3, 'category')}>Categoría</Th>
                      <Th className="pf-v6-u-text-align-end">
                        <Tooltip content="Editar movimiento/s">
                          <Button
                            variant="primary"
                            size="sm"
                            isDisabled={!isAnyRowSelected}
                            onClick={() => setIsBulkMovementModalOpen(true)}
                            icon={<PencilAltIcon />}
                          />
                        </Tooltip>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {movements?.map((movement, rowIndex) => (
                      <Tr key={rowIndex}>
                        <Td
                          select={{
                            rowIndex,
                            onSelect: (_event, isSelecting) => onSelectRepo(movement, rowIndex, isSelecting),
                            isSelected: isRowSelected(movement),
                          }}
                        />
                        <Td>
                          <Tooltip aria="none" aria-live="polite" content={movement.attributes.date}>
                            <Timestamp dateFormat="short" date={new Date(movement.attributes.date)} />
                          </Tooltip>
                        </Td>
                        <Td>
                          <>
                            <Tooltip
                              aria="none"
                              aria-live="polite"
                              content={movement.attributes.type === 'income' ? 'Ingreso' : 'Gasto'}
                            >
                              <Icon
                                size="xl"
                                iconSize="md"
                                isInline
                                status={movement.attributes.type === 'income' ? 'success' : 'danger'}
                              >
                                {movement.attributes.type === 'income' ? <PlusCircleIcon /> : <MinusCircleIcon />}
                              </Icon>
                            </Tooltip>
                            <Tooltip aria="none" aria-live="polite" content={movement.attributes.description}>
                              <span>{movement.attributes.name}</span>
                            </Tooltip>
                          </>
                        </Td>
                        <Td>
                          <span style={{ color: movement.attributes.amount < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                              movement.attributes.amount,
                            )}
                          </span>
                        </Td>
                        <Td>
                          <Select
                            role="menu"
                            id="edit-categories-select"
                            isOpen={openedCategories?.[movement.id]}
                            selected={movement.attributes.categoryId}
                            onSelect={(_e, categoryId) => {
                              setOpenedCategories({ ...openedCategories, [movement.id]: false });
                              patchMovements([
                                {
                                  ...movement,
                                  attributes: {
                                    ...movement.attributes,
                                    categoryId:
                                      categories?.find((c) => c.id === categoryId)?.id ??
                                      movement.attributes.categoryId,
                                  },
                                },
                              ]);
                            }}
                            onOpenChange={(nextOpen: boolean) =>
                              setOpenedCategories({ ...openedCategories, [movement.id]: nextOpen })
                            }
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                              <MenuToggle
                                variant="plainText"
                                ref={toggleRef}
                                onClick={() =>
                                  setOpenedCategories({
                                    ...openedCategories,
                                    [movement.id]:
                                      openedCategories?.[movement.id] === undefined
                                        ? true
                                        : !openedCategories?.[movement.id],
                                  })
                                }
                                isExpanded={openedCategories?.[movement.id]}
                                style={{ width: '190px' }}
                                isDisabled={isUpdateDisabled}
                              >
                                {categories
                                  ?.find((c) => c.id === movement.attributes.categoryId)
                                  ?.attributes.name.toUpperCase()}
                              </MenuToggle>
                            )}
                          >
                            <SelectList>
                              {categories?.map((category) => (
                                <SelectOption
                                  isDisabled={isUpdateDisabled || category.id === movement.attributes.categoryId}
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.attributes.name}
                                </SelectOption>
                              ))}
                            </SelectList>
                          </Select>
                        </Td>
                        <Td>
                          <Tooltip content="Eliminar movimiento">
                            <Button variant="plain" onClick={() => deleteMovement(movement.id)} icon={<TrashIcon />} />
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
                <Pagination
                  itemCount={total ?? queryState.size}
                  perPage={queryState.size}
                  page={queryState.page}
                  variant={PaginationVariant.bottom}
                  onSetPage={(_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) =>
                    setQueryState({ ...queryState, page })
                  }
                  onPerPageSelect={(
                    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
                    size: number,
                    page: number,
                  ) => setQueryState({ ...queryState, page, size })}
                />
              </>
            );
        }
      })()}
      {isBulkLoadModalOpen ? (
        <BulkLoadMovementModal
          onSubmitCallback={bulkMovements}
          onCloseCallback={() => setIsBulkLoadModalOpen(false)}
          status={bulkMovementsStatus}
        />
      ) : null}
      {isBulkMovementEditModalOpen ? (
        <BulkMovementEditModal
          numberOfSelectedMovements={selectedMovements.length}
          categories={categories}
          onSubmitCallback={({ categoryId, type }: Partial<Pick<Movement['attributes'], 'categoryId' | 'type'>>) =>
            patchMovements(
              selectedMovements?.map(
                (movement) =>
                  ({
                    ...movement,
                    categoryId: categoryId ?? movement.attributes.categoryId,
                    type: type ?? movement.attributes.type,
                  }) as Movement,
              ) ?? [],
            )
          }
          onCloseCallback={() => setIsBulkMovementModalOpen(false)}
        />
      ) : null}

      {isCreateMovementModalOpen ? (
        <CreateEditMovementModal
          categories={categories}
          onSubmitCallback={(movement: Partial<Movement>) => postMovement(movement)}
          onCloseCallback={() => setIsCreateMovementModalOpen(false)}
        />
      ) : null}
    </>
  );
};

export { MovementsTable };
