import { Pagination } from '@app/model/query/Pagination';

const categoriesKeys = {
  all: ['categories'] as const,
  paginate: (baseKey: string, userId: string | undefined, params: Pagination) =>
    [baseKey, ...categoriesKeys.all, userId, { ...params }] as const,
};

export { categoriesKeys };
