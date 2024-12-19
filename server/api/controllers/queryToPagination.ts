import { ParsedQs } from 'qs';

export const queryToPagination = ({ page, size }: ParsedQs) =>
  page && size ? { skip: (+page - 1) * +size, take: +size } : { skip: 0, take: size ? +size : 10 };
