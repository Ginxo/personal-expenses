import { MovementsByCategoryQuery } from '@app/model/query/MovementsByCategoryQuery';
import { MovementsQuery } from '@app/model/query/MovementsQuery';

const movementsKeys = {
  all: ['movements'] as const,
  paginate: (baseKey: string, params?: MovementsQuery) => [baseKey, ...movementsKeys.all, { ...params }] as const,
  byCategory: (baseKey: string, numberOfMonths?: number, params?: MovementsByCategoryQuery) =>
    [baseKey, ...movementsKeys.all, 'byCategory', numberOfMonths, { ...params }] as const,
  patch: (baseKey: string) => [baseKey, ...movementsKeys.all, 'patch'] as const,
  post: (baseKey: string) => [baseKey, ...movementsKeys.all, 'post'] as const,
  delete: (baseKey: string) => [baseKey, ...movementsKeys.all, 'delete'] as const,
  bulk: (baseKey: string) => [baseKey, ...movementsKeys.all, 'bulk'] as const,
};

export { movementsKeys };
