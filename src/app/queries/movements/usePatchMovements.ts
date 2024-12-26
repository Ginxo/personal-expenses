import { Movement } from '@app/model/Movement';
import { patchMovements } from '@app/services/movements/movementsService';
import { useMutation } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { refetchMovements } from './useFetchMovements';
import { useFetchAccessToken } from '../users/useFetchToken';

export const usePatchMovements = (baseKey: string) => {
  const { accessToken } = useFetchAccessToken();

  const { mutate, data, error, status } = useMutation({
    mutationKey: movementsKeys.patch(baseKey),
    mutationFn: async (movements: Movement[]) => await patchMovements(movements, accessToken!),
    onSuccess: () => refetchMovements(baseKey),
  });

  return {
    mutate,
    data,
    status,
    error,
  };
};
