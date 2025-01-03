import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { User } from '@app/model/User';
import {
  Button,
  Icon,
  Pagination,
  PaginationVariant,
  Timestamp,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
} from '@patternfly/react-core';
import { MinusCircleIcon, PencilAltIcon, PlusCircleIcon, TrashIcon } from '@patternfly/react-icons';
import { Table, TableVariant, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import { MutationStatus, QueryStatus } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { CategoriesSelect } from '../CategoriesSelect';
import { BulkLoadMovementModal } from '../modals/BulkLoadMovementModal';
import { BulkMovementEditModal } from '../modals/BulkMovementEditModal';
import { ConfirmDeleteMovementModal } from '../modals/ConfirmDeleteMovementModal';
import { CreateEditMovementModal } from '../modals/CreateEditMovementModal';
import { MovementsTableSkeleton } from './MovementsTableSkeleton';
import { MovementsTableToolbar } from './MovementsTableToolbar';

type MovementsTableProps = {
  user: User;
  movements?: Movement[];
  categories?: Category[];
  total?: number;
  queryStatus: QueryStatus;
  patchStatus: MutationStatus;
  bulkMovementsStatus: MutationStatus;
  postCategoryStatus: MutationStatus;
  movementsQuery: MovementsQuery;
  queryChangeCallback?: (query: MovementsQuery) => void;
  refetchMovementsCallback: () => void;
  patchMovements: (movements: Movement[]) => void;
  postMovement: (movement: Partial<Movement>) => void;
  postCategory: (category: Partial<Category>) => void;
  deleteMovements: (movements: Movement[]) => void;
  bulkMovements: (movements: Movement[]) => void;
  invalidateBulkMovements: () => void;
  newCategory?: Category;
};

const MovementsTable = ({
  user,
  movements,
  categories,
  total,
  queryStatus,
  patchStatus,
  bulkMovementsStatus,
  postCategoryStatus,
  movementsQuery,
  queryChangeCallback,
  refetchMovementsCallback,
  patchMovements,
  postMovement,
  postCategory,
  deleteMovements,
  bulkMovements,
  invalidateBulkMovements,
  newCategory,
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

  const [selectedMovementToEdit, setSelectedMovementToEdit] = React.useState<Movement>();

  const [isDeleteMovementModalOpen, setIsDeleteMovementModalOpen] = React.useState(false);

  const isUpdateDisabled = useMemo(() => ![queryStatus, patchStatus].includes('success'), [patchStatus, queryStatus]);

  React.useEffect(() => {
    if (queryChangeCallback && JSON.stringify(movementsQuery) !== JSON.stringify(queryState)) {
      queryChangeCallback(queryState);
    }
    // avoid reaction on pagination
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryState, queryChangeCallback]);

  React.useEffect(() => setQueryState(movementsQuery), [movementsQuery, setQueryState]);

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
        queryChangeCallback={(query) => {
          setQueryState({ ...queryState, ...query, page: 1 });
        }}
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
                        screenReaderText="selector"
                      />
                      <Th sort={getSortParams(0, 'date')}>Fecha</Th>
                      <Th sort={getSortParams(1, 'name')}>Concepto</Th>
                      <Th sort={getSortParams(2, 'amount')}>Importe</Th>
                      <Th sort={getSortParams(3, 'category')}>Categoría</Th>
                      <Th className="pf-v6-u-text-align-end" screenReaderText="actions">
                        <ToolbarGroup variant="action-group">
                          <ToolbarItem>
                            <Tooltip content="Editar movimiento/s">
                              <Button
                                variant="primary"
                                size="sm"
                                isDisabled={!isAnyRowSelected}
                                onClick={() => setIsBulkMovementModalOpen(true)}
                                icon={<PencilAltIcon />}
                              />
                            </Tooltip>
                          </ToolbarItem>
                          <ToolbarItem>
                            <Tooltip content="Borrar movimiento/s">
                              <Button
                                variant="primary"
                                size="sm"
                                isDisabled={!isAnyRowSelected}
                                onClick={() => {
                                  setSelectedMovements(selectedMovements);
                                  setIsDeleteMovementModalOpen(true);
                                }}
                                icon={<TrashIcon />}
                              />
                            </Tooltip>
                          </ToolbarItem>
                        </ToolbarGroup>
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
                          <Tooltip aria="none" aria-live="polite" content={movement.date}>
                            <Timestamp dateFormat="short" date={new Date(movement.date)} />
                          </Tooltip>
                        </Td>
                        <Td>
                          <>
                            <Tooltip
                              aria="none"
                              aria-live="polite"
                              content={movement.type === 'income' ? 'Ingreso' : 'Gasto'}
                            >
                              <Icon
                                size="xl"
                                iconSize="md"
                                isInline
                                status={movement.type === 'income' ? 'success' : 'danger'}
                              >
                                {movement.type === 'income' ? <PlusCircleIcon /> : <MinusCircleIcon />}
                              </Icon>
                            </Tooltip>
                            <Tooltip aria="none" aria-live="polite" content={movement.description}>
                              <span>{movement.name}</span>
                            </Tooltip>
                          </>
                        </Td>
                        <Td>
                          <span style={{ color: movement.amount < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                              movement.amount,
                            )}
                          </span>
                        </Td>
                        <Td>
                          <CategoriesSelect
                            movement={movement}
                            movements={movements}
                            categories={categories}
                            user={user}
                            postCategory={postCategory}
                            patchMovements={patchMovements}
                            patchStatus={patchStatus}
                            postCategoryStatus={postCategoryStatus}
                            isUpdateDisabled={isUpdateDisabled}
                            newCategory={newCategory}
                          />
                        </Td>
                        <Td>
                          <Tooltip content="Eliminar movimiento">
                            <Button
                              variant="plain"
                              onClick={() => {
                                setSelectedMovements([movement]);
                                setIsDeleteMovementModalOpen(true);
                              }}
                              icon={<TrashIcon />}
                            />
                          </Tooltip>
                          <Tooltip content="Editar movimiento">
                            <Button
                              variant="plain"
                              onClick={() => {
                                setSelectedMovementToEdit(movement);
                                setIsCreateMovementModalOpen(true);
                              }}
                              icon={<PencilAltIcon />}
                            />
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
          onCloseCallback={() => {
            setIsBulkLoadModalOpen(false);
            invalidateBulkMovements();
          }}
          status={bulkMovementsStatus}
          userId={user.id}
        />
      ) : null}
      {isBulkMovementEditModalOpen ? (
        <BulkMovementEditModal
          numberOfSelectedMovements={selectedMovements.length}
          categories={categories}
          onSubmitCallback={({ categoryId, type }: Partial<Pick<Movement, 'categoryId' | 'type'>>) =>
            patchMovements(
              selectedMovements?.map(
                (movement) =>
                  ({
                    ...movement,
                    categoryId: categoryId ?? movement.categoryId,
                    category: categories?.find((c) => movement.categoryId === c.id),
                    type: type ?? movement.type,
                  }) as Movement,
              ) ?? [],
            )
          }
          onCloseCallback={() => setIsBulkMovementModalOpen(false)}
        />
      ) : null}

      {isCreateMovementModalOpen && user ? (
        <CreateEditMovementModal
          user={user}
          categories={categories}
          onSubmitCallback={(movement: Partial<Movement>) =>
            selectedMovementToEdit ? patchMovements([movement as Movement]) : postMovement(movement)
          }
          onCloseCallback={() => setIsCreateMovementModalOpen(false)}
          movement={selectedMovementToEdit}
        />
      ) : null}

      {isDeleteMovementModalOpen && selectedMovements?.length ? (
        <ConfirmDeleteMovementModal
          movements={selectedMovements}
          onClose={() => {
            setSelectedMovements([]);
            setIsDeleteMovementModalOpen(false);
          }}
          onConfirm={() => {
            deleteMovements(selectedMovements);
            setSelectedMovements([]);
            setIsDeleteMovementModalOpen(false);
          }}
        />
      ) : null}
    </>
  );
};

export { MovementsTable };
