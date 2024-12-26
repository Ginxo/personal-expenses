import { CategoriesQuery } from '@app/model/query/CategoriesQuery';

const categoriesKeys = {
  all: ['categories'] as const,
  paginate: (baseKey: string, params?: CategoriesQuery) => [baseKey, ...categoriesKeys.all, { ...params }] as const,
  post: (baseKey: string) => [baseKey, ...categoriesKeys.all, 'post'] as const,
};

export { categoriesKeys };
