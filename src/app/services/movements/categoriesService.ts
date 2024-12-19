import { CategoryList } from '@app/model/CategoryList';
import { CategoriesQuery } from '@app/model/query/CategoriesQuery';
import { stringify } from 'qs';
import apiRequest from '../apiRequest';
import { Category } from '@app/model/Category';
import { AxiosResponse } from 'axios';

const getCategories = (userId: string, queryParams: CategoriesQuery) =>
  apiRequest.get<CategoryList>(`/categories/${userId}?${stringify(queryParams, { encode: false, indices: false })}`, {
    headers: {
      Accept: 'application/json',
    },
  });

const postCategory = (category: Partial<Category>): Promise<AxiosResponse<Category>> =>
  apiRequest.post<Category>('/categories', category);

export { getCategories, postCategory };
