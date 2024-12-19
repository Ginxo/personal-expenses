import { CategoryList } from '@app/model/CategoryList';
import { Pagination } from '@app/model/query/Pagination';
import { stringify } from 'qs';
import apiRequest from '../apiRequest';

const getCategories = (queryParams: Pagination) =>
  apiRequest.get<CategoryList>(`/categories?${stringify(queryParams, { encode: false, indices: false })}`, {
    headers: {
      Accept: 'application/json',
    },
  });

export { getCategories };
