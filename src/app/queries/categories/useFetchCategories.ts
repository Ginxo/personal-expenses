import { Pagination } from '@app/model/query/Pagination';
import { getCategories } from '@app/services/movements/categoriesService';
import { useQuery } from '@tanstack/react-query';
import { categoriesKeys } from './categoriesKeys';
import { useFetchUser } from '../users/useFetchUser';
import { queryClient } from '@app/queryClient';
import { useFetchAccessToken } from '../users/useFetchToken';

export const refetchCategories = (baseKey: string) =>
  queryClient.invalidateQueries({ queryKey: categoriesKeys.paginate(baseKey) });

export const useFetchCategories = (baseKey: string, params: Pagination) => {
  const { user } = useFetchUser();
  const { accessToken } = useFetchAccessToken();

  const userId: string = user?.id as string;

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: categoriesKeys.paginate(baseKey, params),
    enabled: !!userId && accessToken !== undefined,
    queryFn: () => getCategories(userId, params, accessToken!),
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
