import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { Button, Icon, Label, Pagination, PaginationVariant, Timestamp, Tooltip } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import { MutationStatus, QueryStatus } from '@tanstack/react-query';
import React from 'react';
import { BulkMovementChangeModal } from '../BulkMovementChangeModal';
import { MovementsTableFilter } from './MovementsTableFilter';
import { MovementsTableSkeleton } from './MovementsTableSkeleton';

type MovementsTableProps = {
  movements?: Movement[];
  categories?: Category[];
  total?: number;
  queryStatus: QueryStatus;
  patchStatus: MutationStatus;
  movementsQuery: MovementsQuery;
  queryChangeCallback?: (query: MovementsQuery) => void;
  patchMovements: (movements: Movement[]) => void;
};

const MovementsTable = ({
  movements,
  categories,
  total,
  queryStatus,
  patchStatus,
  movementsQuery,
  queryChangeCallback,
  patchMovements,
}: MovementsTableProps) => {
  const [activeSortIndex, setActiveSortIndex] = React.useState<number>();
  const [activeSortDirection, setActiveSortDirection] = React.useState<'asc' | 'desc'>();
  const [queryState, setQueryState] = React.useState<MovementsQuery>(movementsQuery);

  const [selectedMovements, setSelectedMovements] = React.useState<Movement[]>([]);
  const [shifting, setShifting] = React.useState(false);
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState<number | null>(null);
  const isAnyRowSelected = selectedMovements.length > 0;
  const areAllRowsSelected = selectedMovements.length === movements?.length;

  const [isBulkMovementModalOpen, setIsBulkMovementModalOpen] = React.useState(false);

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
      <MovementsTableFilter
        query={queryState}
        queryChangeCallback={(query) => setQueryState({ ...queryState, ...query })}
        disabled={![queryStatus, patchStatus].includes('success')}
        categories={categories}
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
                <Table aria-label="Sortable table for movements">
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
                      <Th>
                        <Button
                          variant="primary"
                          size="sm"
                          isDisabled={!isAnyRowSelected}
                          onClick={() => setIsBulkMovementModalOpen(true)}
                        >
                          Editar Selección
                        </Button>
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
                          <Label>{movement.category.name.toUpperCase()}</Label>
                        </Td>
                        <Td></Td>
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
      {isBulkMovementModalOpen ? (
        <BulkMovementChangeModal
          numberOfSelectedMovements={selectedMovements.length}
          categories={categories}
          onSubmitCallback={({ category, type }: Partial<Pick<Movement, 'category' | 'type'>>) =>
            patchMovements(
              selectedMovements?.map(
                (movement) =>
                  ({ ...movement, category: category ?? movement.category, type: type ?? movement.type }) as Movement,
              ) ?? [],
            )
          }
          onCloseCallback={() => setIsBulkMovementModalOpen(false)}
        />
      ) : null}
    </>
  );
};

export { MovementsTable };
