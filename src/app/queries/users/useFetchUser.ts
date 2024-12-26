import { getUser } from '@app/services/movements/usersService';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { useFetchAccessToken } from './useFetchToken';
import { usersKeys } from './usersKeys';

export const useFetchUser = () => {
  const { user } = useAuth0();
  const { accessToken } = useFetchAccessToken();

  const userEmail = user?.email as string;

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: usersKeys.getUser(),
    enabled: !!userEmail && accessToken !== undefined,
    queryFn: () => getUser(userEmail, accessToken!),
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
