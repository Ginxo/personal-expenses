import { Movement } from '../Movement';
import { Pagination } from './Pagination';
import { Sorting } from './Sorting';

type MovementsQuery = {
  from?: string;
  to?: string;
  name?: string;
  amount?: number;
  categories?: string[];
  types?: Movement['attributes']['type'][];
} & Pagination &
  Sorting;

export { MovementsQuery };
