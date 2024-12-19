import { getUser } from '@app/services/movements/usersService';
import { useQuery } from '@tanstack/react-query';
import { usersKeys } from './usersKeys';
import { useAuth0 } from '@auth0/auth0-react';

export const useFetchUser = () => {
  const { user } = useAuth0();

  const userEmail = user?.email as string;

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: usersKeys.getUser(),
    enabled: !!userEmail,
    queryFn: () => getUser(userEmail),
    retry: false,
    staleTime: Infinity,
  });

  return {
    user: data?.data,
    error,
    dataUpdatedAt,
    status: isRefetching ? 'pending' : status,
    refetch,
  };
};
