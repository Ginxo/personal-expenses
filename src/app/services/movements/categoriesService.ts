import { CategoryList } from '@app/model/CategoryList';
import { CategoriesQuery } from '@app/model/query/CategoriesQuery';
import { stringify } from 'qs';
import apiRequest from '../apiRequest';

const getCategories = (userId: string, queryParams: CategoriesQuery) =>
  apiRequest.get<CategoryList>(`/categories/${userId}?${stringify(queryParams, { encode: false, indices: false })}`, {
    headers: {
      Accept: 'application/json',
    },
  });

export { getCategories };
