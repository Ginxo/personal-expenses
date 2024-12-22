import { CategorySum } from '@app/model/CategorySum';
import { Movement } from '@app/model/Movement';
import { MovementList } from '@app/model/MovementList';
import { MovementsByCategoryQuery } from '@app/model/query/MovementsByCategoryQuery';
import { MovementsQuery } from '@app/model/query/MovementsQuery';
import { stringify } from 'qs';
import apiRequest from '../apiRequest';

const getMovements = (userId: string, queryParams: MovementsQuery) => {
  const { categories, types, ...rest } = queryParams;
  const categoriesFilter = categories?.length ? { categories: categories?.join(',') } : {};
  const typesFilter = types?.length ? { types: types?.join(',') } : {};
  return apiRequest.get<MovementList>(
    `/movements/${userId}?${stringify({ ...categoriesFilter, ...typesFilter, ...rest }, { encode: false, indices: false })}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
};

const getMovementsByCategory = (userId: string, queryParams: MovementsByCategoryQuery) => {
  const { categories, ...rest } = queryParams;
  const categoriesFilter = categories?.length ? { categories: categories?.join(',') } : {};
  return apiRequest.get<CategorySum[]>(
    `/movements/${userId}/group/category?${stringify({ ...categoriesFilter, ...rest }, { encode: false, indices: false })}`,
    {
      headers: {
        Accept: 'application/json',
      },
    },
  );
};

const postMovement = (movement: Partial<Movement>) => apiRequest.post<Movement>('/movements', movement);

const deleteMovement = (id: string) => apiRequest.delete(`/movements/${id}`);

const deleteMovements = (ids: string[]) => apiRequest.post('/movements/delete', ids);

const patchMovements = (movements: Movement[]) => apiRequest.patch<{ status: number }>('/movements', movements);

const bulkMovements = (movements: Movement[]) => apiRequest.post<MovementList>('/movements/bulk', movements);

export {
  bulkMovements, deleteMovement,
  deleteMovements, getMovements,
  getMovementsByCategory, patchMovements, postMovement
};

