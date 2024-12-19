import { useQuery } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { getMovements } from '@app/services/movements/movementsService';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { queryClient } from '@app/queryClient';
import { useFetchUser } from '../users/useFetchUser';

export const refetchMovements = (baseKey: string) =>
  queryClient.invalidateQueries({ queryKey: movementsKeys.paginate(baseKey) });

export const useFetchMovements = (baseKey: string, query: MovementsQuery) => {
  const { user } = useFetchUser();

  const userId: string = user?.id as string;

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: movementsKeys.paginate(baseKey, query),
    queryFn: () => getMovements(userId, query),
    enabled: !!userId,
    retry: false,
  });

  return {
    data: data?.data,
    error,
    dataUpdatedAt,
    status: isRefetching ? 'pending' : status,
    refetch,
  };
};
