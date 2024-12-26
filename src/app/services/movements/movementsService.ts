import { CategorySum } from '@app/model/CategorySum';
import { Movement } from '@app/model/Movement';
import { MovementList } from '@app/model/MovementList';
import { MovementsByCategoryQuery } from '@app/model/query/MovementsByCategoryQuery';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { stringify } from 'qs';
import { apiRequest } from '../apiRequest';

const getMovements = (userId: string, queryParams: MovementsQuery, accessToken: string) => {
  const { categories, types, ...rest } = queryParams;
  const categoriesFilter = categories?.length ? { categories: categories?.join(',') } : {};
  const typesFilter = types?.length ? { types: types?.join(',') } : {};
  return apiRequest(accessToken).get<MovementList>(
    `/movements/${userId}?${stringify({ ...categoriesFilter, ...typesFilter, ...rest }, { encode: false, indices: false })}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
};

const getMovementsByCategory = (userId: string, queryParams: MovementsByCategoryQuery, accessToken: string) => {
  const { categories, ...rest } = queryParams;
  const categoriesFilter = categories?.length ? { categories: categories?.join(',') } : {};
  return apiRequest(accessToken).get<CategorySum[]>(
    `/movements/${userId}/group/category?${stringify({ ...categoriesFilter, ...rest }, { encode: false, indices: false })}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
};

const postMovement = (movement: Partial<Movement>, accessToken: string) =>
  apiRequest(accessToken).post<Movement>('/movements', movement);

const deleteMovement = (id: string, accessToken: string) => apiRequest(accessToken).delete(`/movements/${id}`);

const deleteMovements = (ids: string[], accessToken: string) => apiRequest(accessToken).post('/movements/delete', ids);

const patchMovements = (movements: Movement[], accessToken: string) =>
  apiRequest(accessToken).patch<{ status: number }>('/movements', movements);

const bulkMovements = (movements: Movement[], accessToken: string) =>
  apiRequest(accessToken).post<MovementList>('/movements/bulk', movements);

export {
  bulkMovements,
  deleteMovement,
  deleteMovements,
  getMovements,
  getMovementsByCategory,
  patchMovements,
  postMovement
};

