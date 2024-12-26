import { deleteMovements } from '@app/services/movements/movementsService';
import { useMutation } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { refetchMovements } from './useFetchMovements';
import { useFetchAccessToken } from '../users/useFetchToken';

export const useDeleteMovements = (baseKey: string) => {
  const { accessToken } = useFetchAccessToken();

  const { mutate, data, error, status } = useMutation({
    mutationKey: movementsKeys.delete(baseKey),
    mutationFn: async (ids: string[]) => await deleteMovements(ids, accessToken!),
    onSuccess: () => refetchMovements(baseKey),
  });

  return {
    mutate,
    data,
    status,
    error,
  };
};
