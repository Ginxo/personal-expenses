import { useAuth0 } from '@auth0/auth0-react';
import { useQuery } from '@tanstack/react-query';
import { usersKeys } from './usersKeys';

export const useFetchAccessToken = () => {
  const { user, getAccessTokenSilently } = useAuth0();

  const { data, error, dataUpdatedAt, status, refetch, isRefetching } = useQuery({
    queryKey: usersKeys.getAccessToken(),
    enabled: !!user?.email,
    queryFn: async () => await getAccessTokenSilently(),
    retry: false,
    staleTime: Infinity,
  });

  return {
    accessToken: data,
    error,
    dataUpdatedAt,
    status: isRefetching ? 'pending' : status,
    refetch,
  };
};
