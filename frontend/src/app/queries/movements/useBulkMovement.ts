import { Movement } from '@app/model/Movement';
import { bulkMovements } from '@app/services/movements/movementsService';
import { useMutation } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { refetchMovements } from './useFetchMovements';
import { useFetchAccessToken } from '../users/useFetchToken';

export const useBulkMovement = (baseKey: string) => {
  const { accessToken } = useFetchAccessToken();

  const { mutate, data, error, status, reset } = useMutation({
    mutationKey: movementsKeys.bulk(baseKey),
    mutationFn: async (movements: Movement[]) => await bulkMovements(movements, accessToken!),
    onSuccess: () => refetchMovements(baseKey),
  });

  return {
    mutate,
    reset,
    data,
    status,
    error,
  };
};
