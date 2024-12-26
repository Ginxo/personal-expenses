import { Category } from '@app/model/Category';
import { postCategory } from '@app/services/movements/categoriesService';
import { useMutation } from '@tanstack/react-query';
import { categoriesKeys } from './categoriesKeys';
import { refetchCategories } from './useFetchCategories';
import { useFetchAccessToken } from '../users/useFetchToken';

export const usePostCategory = (baseKey: string) => {
  const { accessToken } = useFetchAccessToken();

  const { mutate, data, error, status, reset } = useMutation({
    mutationKey: categoriesKeys.post(baseKey),
    mutationFn: async (category: Partial<Category>) => await postCategory(category, accessToken!),
    onSuccess: () => refetchCategories(baseKey),
  });

  return {
    mutate,
    reset,
    data: data?.data,
    status,
    error,
  };
};
