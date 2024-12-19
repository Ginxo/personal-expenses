import { deleteMovements } from '@app/services/movements/movementsService';
import { useMutation } from '@tanstack/react-query';
import { movementsKeys } from './movementsKeys';
import { refetchMovements } from './useFetchMovements';

export const useDeleteMovements = (baseKey: string) => {
  const { mutate, data, error, status } = useMutation({
    mutationKey: movementsKeys.delete(baseKey),
    mutationFn: async (ids: string[]) => await deleteMovements(ids),
    onSuccess: () => refetchMovements(baseKey),
  });

  return {
    mutate,
    data,
    status,
    error,
  };
};
