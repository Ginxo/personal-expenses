import { deleteMovement } from '@app/services/movements/movementsService';
import { useMutation } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { refetchMovements } from './useFetchMovements';
import { useFetchAccessToken } from '../users/useFetchToken';

export const useDeleteMovement = (baseKey: string) => {
  const { accessToken } = useFetchAccessToken();

  const { mutate, data, error, status } = useMutation({
    mutationKey: movementsKeys.delete(baseKey),
    mutationFn: async (id: string) => await deleteMovement(id, accessToken!),
    onSuccess: () => refetchMovements(baseKey),
  });

  return {
    mutate,
    data,
    status,
    error,
  };
};
