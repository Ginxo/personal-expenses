import { Movement } from '@app/model/Movement';
import { bulkMovements } from '@app/services/movements/movementsService';
import { useMutation } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { refetchMovements } from './useFetchMovements';

export const useBulkMovement = (baseKey: string) => {
  const { mutate, data, error, status, reset } = useMutation({
    mutationKey: movementsKeys.bulk(baseKey),
    mutationFn: async (movements: Movement[]) => await bulkMovements(movements),
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
