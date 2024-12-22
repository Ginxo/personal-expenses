import { CategorySum } from '@app/model/CategorySum';
import { MovementsByCategoryQuery } from '@app/model/query/MovementsByCategoryQuery';
import { queryClient } from '@app/queryClient';
import { getMovementsByCategory } from '@app/services/movements/movementsService';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFetchUser } from '../users/useFetchUser';
import { movementsKeys } from './movementsKeys';

export const refetchMovements = (baseKey: string) =>
  queryClient.invalidateQueries({ queryKey: movementsKeys.byCategory(baseKey) });

const select = (
  data: {
    [x: string]: CategorySum[];
  }[],
) => data.reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const useFetchMovementsByCategory = (
  baseKey: string,
  numberOfMonths: number,
  query: MovementsByCategoryQuery,
) => {
  const { user } = useFetchUser();

  const userId: string = user?.id as string;

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: movementsKeys.byCategory(baseKey, numberOfMonths, query),
    queryFn: async () => {
      const now = dayjs();
      return await Promise.all(
        [...Array(numberOfMonths).keys()]
          .map((key) => ({
            key: now.subtract(key, 'month').format('MM/YYYY'),
            from: now.subtract(key, 'month').startOf('month').toISOString(),
            to: now.subtract(key, 'month').endOf('month').toISOString(),
          }))
          .map(async (dateFilter) => ({
            [`${dateFilter.key}`]: await getMovementsByCategory(userId, {
              ...query,
              from: dateFilter.from,
              to: dateFilter.to,
            }).then((response) => response.data),
          }))
          .map((response) => response.then((e) => e)),
      );
    },
    select,
    enabled: !!userId,
    retry: false,
  });

  return {
    data,
    error,
    dataUpdatedAt,
    status: isRefetching ? 'pending' : status,
    refetch,
  };
};
