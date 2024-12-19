import { MovementsTable } from '@app/Movements/table/MovementsTable';
import { Movement } from '@app/model/Movement';
import { CategoriesQuery } from '@app/model/query/CategoriesQuery';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { useFetchCategories } from '@app/queries/categories/useFetchCategories';
import { useBulkMovement } from '@app/queries/movements/useBulkMovement';
import { useDeleteMovement } from '@app/queries/movements/useDeleteMovement';
import { useFetchMovements } from '@app/queries/movements/useFetchMovements';
import { usePatchMovements } from '@app/queries/movements/usePatchMovements';
import { usePostMovement } from '@app/queries/movements/usePostMovement';
import { useFetchUser } from '@app/queries/users/useFetchUser';
import { PageSection, Title } from '@patternfly/react-core';
import * as React from 'react';

const Dashboard: React.FunctionComponent = () => {
  const { user } = useFetchUser();

  const [movementsQuery, setMovementsQuery] = React.useState<MovementsQuery>({
    page: 1,
    size: 20,
    direction: 'asc',
  });
  const [categoriesQuery] = React.useState<CategoriesQuery>({
    page: 1,
    size: 15,
    direction: 'asc',
  });

  const fetchMovements = useFetchMovements('dashboard', movementsQuery);
  const fetchCategories = useFetchCategories('dashboard', categoriesQuery);
  const patchMovements = usePatchMovements('dashboard');
  const bulkMovements = useBulkMovement('dashboard');
  const postMovement = usePostMovement('dashboard');
  const deleteMovement = useDeleteMovement('dashboard');

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Dashboard
      </Title>
      <MovementsTable
        user={user}
        movements={fetchMovements.data?.data}
        categories={fetchCategories.data?.data}
        total={fetchMovements.data?.meta.total}
        queryStatus={fetchMovements.status}
        patchStatus={patchMovements.status}
        bulkMovementsStatus={bulkMovements.status}
        movementsQuery={movementsQuery}
        queryChangeCallback={setMovementsQuery}
        refetchMovementsCallback={() => {
          fetchMovements.refetch();
          fetchCategories.refetch();
        }}
        patchMovements={(movements: Movement[]) => patchMovements.mutate(movements)}
        postMovement={(movement: Partial<Movement>) => postMovement.mutate(movement)}
        deleteMovement={(id: string) => deleteMovement.mutate(id)}
        bulkMovements={(movements: Movement[]) => bulkMovements.mutate(movements)}
      />
    </PageSection>
  );
};

export { Dashboard };
