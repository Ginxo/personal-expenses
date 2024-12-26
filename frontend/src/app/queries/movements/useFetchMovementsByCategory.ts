import { CategorySum } from '@app/model/CategorySum';
import { MovementsByCategoryQuery } from '@app/model/query/MovementsByCategoryQuery';
import { queryClient } from '@app/queryClient';
import { getMovementsByCategory } from '@app/services/movements/movementsService';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useFetchUser } from '../users/useFetchUser';
import { movementsKeys } from './movementsKeys';
import { useFetchAccessToken } from '../users/useFetchToken';

export const refetchMovements = (baseKey: string) =>
  queryClient.invalidateQueries({ queryKey: movementsKeys.byCategory(baseKey) });

const select = (
  data: {
    [x: string]: CategorySum[];
  }[],
) => data.reduce((acc, curr) => ({ ...acc, ...curr }), {});

export const useFetchMovementsByCategory = (baseKey: string, query: MovementsByCategoryQuery) => {
  const { user } = useFetchUser();
  const { accessToken } = useFetchAccessToken();

  const userId: string = user?.id as string;

  const now = dayjs();

  const startingDate = dayjs(query.from ?? now.subtract(3, 'month')).startOf('month');
  const endingDate = dayjs(query.to ?? now).endOf('month');
  const numberOfMonths = Math.abs(endingDate.diff(startingDate, 'months') + 1);

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: movementsKeys.byCategory(baseKey, query),
    queryFn: async () => {
      return await Promise.all(
        [...Array(numberOfMonths).keys()]
          .map((month) => ({
            key: endingDate.subtract(month, 'month').format('MM/YYYY'),
            from: endingDate.subtract(month, 'month').startOf('month').toISOString(),
            to: endingDate.subtract(month, 'month').endOf('month').toISOString(),
          }))
          .map(async (dateFilter) => ({
            [`${dateFilter.key}`]: await getMovementsByCategory(
              userId,
              {
                from: dateFilter.from,
                to: dateFilter.to,
              },
              accessToken!,
            ).then((response) => response.data),
          }))
          .map((response) => response.then((e) => e)),
      );
    },
    select,
    enabled: !!userId && accessToken !== undefined,
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
