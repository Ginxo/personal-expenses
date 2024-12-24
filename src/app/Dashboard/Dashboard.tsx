import { ComboChart } from '@app/Charts/ComboChart';
import { MovementsTable } from '@app/Movements/table/MovementsTable';
import { Category } from '@app/model/Category';
import { Movement } from '@app/model/Movement';
import { CategoriesQuery } from '@app/model/query/CategoriesQuery';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { useFetchCategories } from '@app/queries/categories/useFetchCategories';
import { usePostCategory } from '@app/queries/categories/usePostCategory';
import { useBulkMovement } from '@app/queries/movements/useBulkMovement';
import { useDeleteMovements } from '@app/queries/movements/useDeleteMovements';
import { useFetchMovements } from '@app/queries/movements/useFetchMovements';
import { useFetchMovementsByCategory } from '@app/queries/movements/useFetchMovementsByCategory';
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
    order_by: 'date',
    direction: 'desc',
  });
  const [categoriesQuery] = React.useState<CategoriesQuery>({
    page: 1,
    size: 50,
    order_by: 'name',
    direction: 'asc',
  });

  const fetchMovements = useFetchMovements('dashboard', movementsQuery);
  const fetchCategories = useFetchCategories('dashboard', categoriesQuery);
  const patchMovements = usePatchMovements('dashboard');
  const bulkMovements = useBulkMovement('dashboard');
  const postMovement = usePostMovement('dashboard');
  const postCategory = usePostCategory('dashboard');
  const deleteMovements = useDeleteMovements('dashboard');
  const movementsByCategory = useFetchMovementsByCategory('dashboard', {
    from: movementsQuery.from,
    to: movementsQuery.to,
  });

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Dashboard
      </Title>
      <ComboChart
        categorySumByMonth={movementsByCategory.data}
        categoryList={fetchCategories.data}
        categorySumByMonthStatus={movementsByCategory.status}
        selectedCategories={movementsQuery.categories}
      />
      <MovementsTable
        user={user!}
        movements={fetchMovements.data?.data}
        categories={fetchCategories.data?.data}
        total={fetchMovements.data?.meta.total}
        queryStatus={fetchMovements.status}
        patchStatus={patchMovements.status}
        bulkMovementsStatus={bulkMovements.status}
        postCategoryStatus={postCategory.status}
        movementsQuery={movementsQuery}
        queryChangeCallback={setMovementsQuery}
        refetchMovementsCallback={() => {
          fetchMovements.refetch();
          fetchCategories.refetch();
          movementsByCategory.refetch();
        }}
        patchMovements={(movements: Movement[]) => patchMovements.mutate(movements)}
        postMovement={(movement: Partial<Movement>) => postMovement.mutate(movement)}
        postCategory={(category: Partial<Category>) => postCategory.mutate(category)}
        deleteMovements={(movements: Movement[]) => deleteMovements.mutate(movements.map((m) => m.id))}
        bulkMovements={(movements: Movement[]) => bulkMovements.mutate(movements)}
        invalidateBulkMovements={async () => await bulkMovements.reset()}
        newCategory={postCategory.data}
      />
    </PageSection>
  );
};

export { Dashboard };
